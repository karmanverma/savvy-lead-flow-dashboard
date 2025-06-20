
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

    // Get ElevenLabs API key from environment
    const elevenLabsApiKey = Deno.env.get('ELEVENLABS_API_KEY')
    if (!elevenLabsApiKey) {
      console.error('ElevenLabs API key not found in environment')
      throw new Error('ElevenLabs API key not configured')
    }

    console.log('Using ElevenLabs API key (first 10 chars):', elevenLabsApiKey.substring(0, 10))

    // Create agent in ElevenLabs first
    const elevenLabsPayload = {
      name: agentData.name,
      prompt: {
        prompt: agentData.system_prompt,
      },
      first_message: agentData.first_message_script,
      voice_id: agentData.voice_id,
      language: agentData.language || 'en',
    }
    
    console.log('Creating ElevenLabs agent with payload:', elevenLabsPayload)

    const elevenLabsResponse = await fetch('https://api.elevenlabs.io/v1/convai/agents', {
      method: 'POST',
      headers: {
        'xi-api-key': elevenLabsApiKey,
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
      voice_settings: agentData.voice_settings || {
        stability: 0.8,
        similarity_boost: 0.6,
        style: 0.2,
        use_speaker_boost: true
      },
      llm_config: agentData.llm_config || {
        model: 'gpt-4',
        temperature: 0.7,
        max_tokens: 1000
      },
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
            'xi-api-key': elevenLabsApiKey,
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
