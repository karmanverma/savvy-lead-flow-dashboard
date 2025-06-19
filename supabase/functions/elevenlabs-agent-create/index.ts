
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CreateAgentRequest {
  name: string;
  description?: string;
  system_prompt: string;
  first_message_script: string;
  voice_id: string;
  voice_settings?: {
    stability: number;
    similarity_boost: number;
    style: number;
    use_speaker_boost: boolean;
  };
  llm_config?: {
    model: string;
    temperature: number;
    max_tokens: number;
  };
  max_call_duration?: number;
  language?: string;
  call_objectives?: string[];
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

    const agentData: CreateAgentRequest = await req.json()

    // Create agent in ElevenLabs
    const elevenLabsResponse = await fetch('https://api.elevenlabs.io/v1/convai/agents', {
      method: 'POST',
      headers: {
        'xi-api-key': Deno.env.get('ELEVENLABS_API_KEY')!,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: agentData.name,
        prompt: {
          prompt: agentData.system_prompt,
        },
        first_message: agentData.first_message_script,
        voice_id: agentData.voice_id,
        language: agentData.language || 'en',
      }),
    })

    if (!elevenLabsResponse.ok) {
      const error = await elevenLabsResponse.text()
      throw new Error(`ElevenLabs API error: ${error}`)
    }

    const elevenLabsAgent = await elevenLabsResponse.json()

    // Store in database
    const { data: dbAgent, error: dbError } = await supabase
      .from('ai_agents')
      .insert({
        name: agentData.name,
        description: agentData.description,
        system_prompt: agentData.system_prompt,
        first_message_script: agentData.first_message_script,
        voice_id: agentData.voice_id,
        voice_settings: agentData.voice_settings || {},
        llm_config: agentData.llm_config || {
          model: 'gpt-4',
          temperature: 0.7,
          max_tokens: 1000
        },
        max_call_duration: agentData.max_call_duration || 300,
        language: agentData.language || 'en',
        call_objectives: agentData.call_objectives || [],
        elevenlabs_agent_id: elevenLabsAgent.agent_id,
        is_active: true,
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      throw new Error('Failed to store agent in database')
    }

    return new Response(
      JSON.stringify({ success: true, agent: dbAgent }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Agent creation error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
