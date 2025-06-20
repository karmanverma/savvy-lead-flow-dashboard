
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
    
    if (req.method !== 'GET') {
      console.error('Invalid method for voices endpoint:', req.method)
      return new Response('Method not allowed', { status: 405, headers: corsHeaders })
    }

    // Get ElevenLabs API key from environment
    const elevenLabsApiKey = Deno.env.get('ELEVENLABS_API_KEY')
    if (!elevenLabsApiKey) {
      console.error('ElevenLabs API key not found in environment')
      throw new Error('ElevenLabs API key not configured')
    }

    console.log('Fetching voices from ElevenLabs API...')
    console.log('Using API key (first 10 chars):', elevenLabsApiKey.substring(0, 10))

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
      throw new Error(`Failed to fetch voices from ElevenLabs: ${response.status} - ${errorText}`)
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

  } catch (error) {
    console.error('Error fetching voices:', error)
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
