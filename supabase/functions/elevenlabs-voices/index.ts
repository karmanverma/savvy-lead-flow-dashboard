
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('Voices request received, method:', req.method)
    
    // Get ElevenLabs API key from environment
    const elevenLabsApiKey = Deno.env.get('ELEVENLABS_API_KEY')
    if (!elevenLabsApiKey) {
      console.error('ElevenLabs API key not found in environment')
      return new Response(
        JSON.stringify({ 
          error: 'ElevenLabs API key not configured',
          details: 'Please configure ELEVENLABS_API_KEY in your Supabase secrets'
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('Using API key (first 10 chars):', elevenLabsApiKey.substring(0, 10))

    if (req.method === 'GET') {
      // Fetch voices from ElevenLabs API
      console.log('Fetching voices from ElevenLabs API...')

      const response = await fetch('https://api.elevenlabs.io/v1/voices', {
        method: 'GET',
        headers: {
          'xi-api-key': elevenLabsApiKey,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('ElevenLabs voices API error:', response.status, errorText)
        return new Response(
          JSON.stringify({ 
            error: `Failed to fetch voices from ElevenLabs: ${response.status}`,
            details: errorText
          }),
          { 
            status: response.status,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      const data = await response.json()
      console.log('Successfully fetched voices:', data.voices?.length || 0, 'voices')

      return new Response(
        JSON.stringify(data),
        { 
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )

    } else if (req.method === 'POST') {
      // Handle voice testing
      const body = await req.json()
      console.log('Voice test request body:', body)

      if (body.action === 'test_voice' && body.voice_id) {
        console.log('Testing voice:', body.voice_id)

        const testText = body.text || "Hello, this is a test of my voice. I'm an AI agent ready to help with your real estate needs."

        const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${body.voice_id}`, {
          method: 'POST',
          headers: {
            'xi-api-key': elevenLabsApiKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: testText,
            model_id: 'eleven_multilingual_v2',
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.5,
            },
          }),
        })

        if (!response.ok) {
          const errorText = await response.text()
          console.error('Voice test API error:', response.status, errorText)
          return new Response(
            JSON.stringify({ 
              error: `Voice test failed: ${response.status}`,
              details: errorText
            }),
            { 
              status: response.status,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          )
        }

        const audioBlob = await response.blob()
        const audioArrayBuffer = await audioBlob.arrayBuffer()
        const audioBase64 = btoa(String.fromCharCode(...new Uint8Array(audioArrayBuffer)))
        
        console.log('Voice test completed successfully')
        
        return new Response(
          JSON.stringify({ 
            success: true,
            audio_data: audioBase64,
            content_type: 'audio/mpeg'
          }),
          { 
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      } else {
        return new Response(
          JSON.stringify({ error: 'Invalid request body for POST method' }),
          { 
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

    } else {
      console.error('Invalid method for voices endpoint:', req.method)
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { 
          status: 405,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

  } catch (error) {
    console.error('Error in voices endpoint:', error)
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
