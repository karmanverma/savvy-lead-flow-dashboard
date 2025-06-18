
-- Add all missing columns to ai_agents table
ALTER TABLE public.ai_agents 
ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'en',
ADD COLUMN IF NOT EXISTS phone_number TEXT,
ADD COLUMN IF NOT EXISTS elevenlabs_agent_id TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS conversation_config JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS llm_config JSONB DEFAULT '{"model": "gpt-4", "temperature": 0.7, "max_tokens": 1000}'::jsonb,
ADD COLUMN IF NOT EXISTS webhook_url TEXT;

-- Add ElevenLabs call tracking to call_queue
ALTER TABLE public.call_queue 
ADD COLUMN IF NOT EXISTS elevenlabs_call_id TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS webhook_data JSONB DEFAULT '{}'::jsonb;

-- Now insert the sample AI agent with all required fields
INSERT INTO public.ai_agents (
  name, 
  description, 
  voice_id, 
  first_message_script, 
  system_prompt, 
  call_objectives,
  max_call_duration,
  language,
  phone_number,
  conversation_config,
  llm_config
) VALUES (
  'Sarah - Lead Qualification Specialist',
  'Professional lead qualification agent for real estate inquiries and appointment scheduling',
  '21m00Tcm4TlvDq8ikWAM',
  'Hi, this is Sarah calling from Toronto Digital Real Estate. I hope I''m catching you at a good time. I wanted to follow up on your interest in properties and see how we can help you find your ideal home. Do you have a few minutes to chat?',
  'You are Sarah, a professional lead qualification specialist for Toronto Digital Real Estate. Your role is to qualify leads, gather their property preferences, and schedule appointments with human agents. Be friendly, professional, and helpful. Always ask permission before proceeding with questions and respect if they want to call back later. Focus on understanding their needs, budget, and timeline.',
  ARRAY['Lead Qualification', 'Property Preferences', 'Appointment Scheduling', 'Follow-up Call', 'Budget Verification'],
  300,
  'en',
  '+14161234567',
  jsonb_build_object(
    'turn_detection', jsonb_build_object('threshold', 0.5, 'silence_duration_ms', 800),
    'agent_tools', jsonb_build_array(
      jsonb_build_object(
        'name', 'updateLeadStatus',
        'description', 'Update lead qualification status',
        'parameters', jsonb_build_object(
          'type', 'object',
          'properties', jsonb_build_object(
            'status', jsonb_build_object('type', 'string', 'enum', jsonb_build_array('qualified', 'not_qualified', 'needs_follow_up')),
            'notes', jsonb_build_object('type', 'string')
          )
        )
      )
    )
  ),
  jsonb_build_object('model', 'gpt-4', 'temperature', 0.7, 'max_tokens', 1000)
) ON CONFLICT DO NOTHING;
