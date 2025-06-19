
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function extractCallOutcome(transcript: string): string {
  if (!transcript) return 'unknown'
  
  const lowerTranscript = transcript.toLowerCase()
  
  if (lowerTranscript.includes('appointment') || lowerTranscript.includes('schedule')) {
    return 'appointment_scheduled'
  }
  if (lowerTranscript.includes('qualified') || lowerTranscript.includes('interested')) {
    return 'qualified'
  }
  if (lowerTranscript.includes('not interested') || lowerTranscript.includes('no thank')) {
    return 'not_interested'
  }
  if (lowerTranscript.includes('callback') || lowerTranscript.includes('call back')) {
    return 'callback_requested'
  }
  
  return 'completed'
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    if (req.method !== 'POST') {
      return new Response('Method not allowed', { status: 405, headers: corsHeaders })
    }

    const webhookData = await req.json()
    const url = new URL(req.url)
    const lead_id = url.searchParams.get('lead_id')
    const agent_id = url.searchParams.get('agent_id')

    console.log('Webhook received:', { webhookData, lead_id, agent_id })

    // Update call queue status
    if (webhookData.call_id) {
      const { error: queueError } = await supabase
        .from('call_queue')
        .update({
          status: webhookData.status === 'ended' ? 'completed' : 'in_progress',
          webhook_data: webhookData,
          updated_at: new Date().toISOString(),
        })
        .eq('elevenlabs_call_id', webhookData.call_id)

      if (queueError) {
        console.error('Error updating call queue:', queueError)
      }
    }

    // Process call completion
    if (webhookData.status === 'ended' && lead_id && agent_id) {
      const callOutcome = extractCallOutcome(webhookData.transcript || '')
      
      const { error: recordingError } = await supabase
        .from('call_recordings')
        .insert({
          lead_id,
          ai_agent_id: agent_id,
          elevenlabs_call_id: webhookData.call_id,
          elevenlabs_conversation_id: webhookData.conversation_id,
          recording_url: webhookData.recording_url,
          transcription: webhookData.transcript,
          duration_seconds: webhookData.duration_seconds,
          call_status: 'completed',
          conversation_data: webhookData,
          call_outcome: callOutcome,
          sentiment_score: webhookData.sentiment_score || 0,
        })

      if (recordingError) {
        console.error('Error inserting call recording:', recordingError)
      }

      // Update lead score based on call outcome
      let scoreChange = 0
      switch (callOutcome) {
        case 'appointment_scheduled':
          scoreChange = 20
          break
        case 'qualified':
          scoreChange = 10
          break
        case 'callback_requested':
          scoreChange = 5
          break
        case 'not_interested':
          scoreChange = -5
          break
      }

      if (scoreChange !== 0) {
        await supabase.rpc('increment_lead_score', {
          lead_id: lead_id,
          increment: scoreChange
        })
      }
    }

    return new Response(
      JSON.stringify({ success: true }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Webhook processing error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
