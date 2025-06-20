
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Using local API key for development
const ELEVENLABS_API_KEY = 'sk_3916f6f66157e20925991c16f906e8984d1219f3f0be85ab';

interface CreateAgentRequest {
  name: string;
  description?: string;
  system_prompt: string;
  first_message_script: string;
  voice_id?: string;
  max_call_duration?: number;
  language?: string;
  call_objectives?: string[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('Agent creation request received');
    
    const authHeader = req.headers.get('Authorization')!
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )

    // Verify user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      console.error('Authentication error:', authError)
      return new Response('Unauthorized', { status: 401, headers: corsHeaders })
    }

    if (req.method !== 'POST') {
      return new Response('Method not allowed', { status: 405, headers: corsHeaders })
    }

    const agentData: CreateAgentRequest = await req.json()
    console.log('Creating agent with data:', agentData)

    // Create agent in ElevenLabs using the correct API structure
    const elevenLabsPayload = {
      conversation_config: {
        conversation: {},
        agent: {
          first_message: agentData.first_message_script,
          prompt: {
            prompt: agentData.system_prompt,
          }
        }
      },
      name: agentData.name,
      tags: [user.id] // Using user ID as tag
    }
    
    console.log('Creating ElevenLabs agent with payload:', elevenLabsPayload)

    const elevenLabsResponse = await fetch('https://api.elevenlabs.io/v1/convai/agents/create', {
      method: 'POST',
      headers: {
        'Xi-Api-Key': ELEVENLABS_API_KEY,
        'Api-Key': 'xi-api-key',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(elevenLabsPayload),
    })

    if (!elevenLabsResponse.ok) {
      const errorText = await elevenLabsResponse.text()
      console.error('ElevenLabs API error:', elevenLabsResponse.status, errorText)
      throw new Error(`ElevenLabs API error: ${elevenLabsResponse.status} - ${errorText}`)
    }

    const elevenLabsAgent = await elevenLabsResponse.json()
    console.log('ElevenLabs agent created:', elevenLabsAgent)

    // Store in database with ElevenLabs agent ID
    const dbPayload = {
      name: agentData.name,
      description: agentData.description,
      system_prompt: agentData.system_prompt,
      first_message_script: agentData.first_message_script,
      voice_id: agentData.voice_id,
      max_call_duration: agentData.max_call_duration || 300,
      language: agentData.language || 'en',
      call_objectives: agentData.call_objectives || ['Lead Qualification', 'Property Preferences', 'Appointment Scheduling'],
      elevenlabs_agent_id: elevenLabsAgent.agent_id,
      is_active: true,
      created_by: user.id,
    }

    console.log('Storing agent in database with payload:', dbPayload)

    const { data: dbAgent, error: dbError } = await supabase
      .from('ai_agents')
      .insert(dbPayload)
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      // If database insert fails, we should try to clean up the ElevenLabs agent
      try {
        await fetch(`https://api.elevenlabs.io/v1/convai/agents/${elevenLabsAgent.agent_id}`, {
          method: 'DELETE',
          headers: {
            'Xi-Api-Key': ELEVENLABS_API_KEY,
          },
        })
        console.log('Cleaned up ElevenLabs agent after database error')
      } catch (cleanupError) {
        console.error('Failed to cleanup ElevenLabs agent:', cleanupError)
      }
      throw new Error(`Failed to store agent in database: ${dbError.message}`)
    }

    console.log('Agent successfully created in both ElevenLabs and database:', dbAgent)

    return new Response(
      JSON.stringify({ 
        success: true, 
        agent: dbAgent,
        elevenlabs_agent_id: elevenLabsAgent.agent_id
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Agent creation error:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Check server logs for more information'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
