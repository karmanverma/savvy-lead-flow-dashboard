
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CallRequest {
  lead_id: string;
  ai_agent_id: string;
  call_objective: string;
  priority?: number;
}

function buildContextualPrompt(lead: any, objective: string) {
  return `LEAD CONTEXT:
Name: ${lead.first_name} ${lead.last_name}
Phone: ${lead.phone}
Status: ${lead.status}
Objective: ${objective}

PROPERTY PREFERENCES:
Budget: $${lead.lead_preferences?.budget_min || 'Unknown'} - $${lead.lead_preferences?.budget_max || 'Unknown'}
Bedrooms: ${lead.lead_preferences?.bedrooms_min || 'Any'}+
Areas: ${lead.lead_preferences?.preferred_areas?.join(', ') || 'No preference'}

PREVIOUS INTERACTIONS:
${lead.notes?.slice(0, 3).map((note: any) => `- ${note.content}`).join('\n') || 'No previous notes'}

Remember: Focus on ${objective}. Be professional and helpful. Do not provide real estate advice - refer to licensed agents for that.`
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')!
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )

    // Verify user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return new Response('Unauthorized', { status: 401, headers: corsHeaders })
    }

    if (req.method !== 'POST') {
      return new Response('Method not allowed', { status: 405, headers: corsHeaders })
    }

    const callRequest: CallRequest = await req.json()

    // Get agent data
    const { data: agent, error: agentError } = await supabase
      .from('ai_agents')
      .select('*')
      .eq('id', callRequest.ai_agent_id)
      .single()

    if (agentError || !agent) {
      throw new Error('Agent not found')
    }

    if (!agent.elevenlabs_agent_id) {
      throw new Error('Agent not synced with ElevenLabs')
    }

    // Get lead data with related information
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .select(`
        *, 
        lead_preferences(*), 
        lead_qualification(*),
        notes(content, created_at)
      `)
      .eq('id', callRequest.lead_id)
      .single()

    if (leadError || !lead) {
      throw new Error('Lead not found')
    }

    // Initiate call via ElevenLabs
    const callResponse = await fetch('https://api.elevenlabs.io/v1/convai/calls', {
      method: 'POST',
      headers: {
        'xi-api-key': Deno.env.get('ELEVENLABS_API_KEY')!,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        agent_id: agent.elevenlabs_agent_id,
        customer_phone_number: lead.phone,
        customer_name: `${lead.first_name} ${lead.last_name}`,
      }),
    })

    if (!callResponse.ok) {
      const error = await callResponse.text()
      throw new Error(`ElevenLabs call initiation failed: ${error}`)
    }

    const callData = await callResponse.json()

    // Update call queue
    const { data: queueEntry, error: queueError } = await supabase
      .from('call_queue')
      .update({
        status: 'in_progress',
        elevenlabs_call_id: callData.call_id,
        executed_at: new Date().toISOString(),
      })
      .eq('lead_id', callRequest.lead_id)
      .eq('ai_agent_id', callRequest.ai_agent_id)
      .eq('status', 'scheduled')
      .select()
      .single()

    // If no existing queue entry, create one
    if (queueError) {
      await supabase.from('call_queue').insert({
        lead_id: callRequest.lead_id,
        ai_agent_id: callRequest.ai_agent_id,
        scheduled_time: new Date().toISOString(),
        call_objective: callRequest.call_objective,
        priority: callRequest.priority || 1,
        status: 'in_progress',
        elevenlabs_call_id: callData.call_id,
        executed_at: new Date().toISOString(),
      })
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        call_id: callData.call_id,
        status: 'initiated'
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Call initiation error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
