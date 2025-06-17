
-- Enhanced AI agents table with ElevenLabs integration
CREATE TABLE IF NOT EXISTS public.ai_agents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  voice_id TEXT,
  voice_settings JSONB DEFAULT '{}'::jsonb,
  first_message_script TEXT NOT NULL,
  system_prompt TEXT NOT NULL,
  call_objectives TEXT[] DEFAULT '{}'::text[],
  max_call_duration INTEGER DEFAULT 300,
  retry_settings JSONB DEFAULT '{}'::jsonb,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Call queue for managing scheduled and automated calls
CREATE TABLE IF NOT EXISTS public.call_queue (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID NOT NULL,
  ai_agent_id UUID NOT NULL,
  scheduled_time TIMESTAMP WITH TIME ZONE NOT NULL,
  call_objective TEXT NOT NULL,
  priority INTEGER DEFAULT 3, -- 1=urgent, 2=high, 3=medium, 4=low
  status TEXT NOT NULL DEFAULT 'scheduled', -- scheduled, in_progress, completed, failed, cancelled
  custom_context JSONB DEFAULT '{}'::jsonb,
  retry_count INTEGER DEFAULT 0,
  max_retries INTEGER DEFAULT 3,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  executed_at TIMESTAMP WITH TIME ZONE,
  FOREIGN KEY (lead_id) REFERENCES public.leads(id) ON DELETE CASCADE,
  FOREIGN KEY (ai_agent_id) REFERENCES public.ai_agents(id) ON DELETE CASCADE
);

-- Call recordings and transcriptions
CREATE TABLE IF NOT EXISTS public.call_recordings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  call_id UUID,
  lead_id UUID NOT NULL,
  ai_agent_id UUID,
  recording_url TEXT,
  transcription TEXT,
  conversation_data JSONB DEFAULT '{}'::jsonb,
  duration_seconds INTEGER,
  call_status TEXT NOT NULL, -- completed, failed, interrupted
  sentiment_score DECIMAL(3,2), -- -1.00 to 1.00
  call_outcome TEXT, -- appointment_scheduled, follow_up_needed, not_interested, etc.
  next_action TEXT,
  lead_score_change INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  FOREIGN KEY (call_id) REFERENCES public.calls(id) ON DELETE SET NULL,
  FOREIGN KEY (lead_id) REFERENCES public.leads(id) ON DELETE CASCADE,
  FOREIGN KEY (ai_agent_id) REFERENCES public.ai_agents(id) ON DELETE SET NULL
);

-- AI agent performance tracking
CREATE TABLE IF NOT EXISTS public.ai_agent_performance (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ai_agent_id UUID NOT NULL,
  date DATE NOT NULL,
  total_calls INTEGER DEFAULT 0,
  successful_calls INTEGER DEFAULT 0,
  leads_qualified INTEGER DEFAULT 0,
  appointments_scheduled INTEGER DEFAULT 0,
  average_duration INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  FOREIGN KEY (ai_agent_id) REFERENCES public.ai_agents(id) ON DELETE CASCADE,
  UNIQUE(ai_agent_id, date)
);

-- Business hours and scheduling rules
CREATE TABLE IF NOT EXISTS public.scheduling_rules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  timezone TEXT NOT NULL DEFAULT 'UTC',
  business_hours JSONB NOT NULL DEFAULT '{"monday": {"start": "09:00", "end": "17:00"}, "tuesday": {"start": "09:00", "end": "17:00"}, "wednesday": {"start": "09:00", "end": "17:00"}, "thursday": {"start": "09:00", "end": "17:00"}, "friday": {"start": "09:00", "end": "17:00"}, "saturday": null, "sunday": null}'::jsonb,
  blackout_dates DATE[],
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert default scheduling rules
INSERT INTO public.scheduling_rules (name, is_default) 
VALUES ('Default Business Hours', true)
ON CONFLICT DO NOTHING;

-- Add triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_ai_agents_updated_at BEFORE UPDATE ON public.ai_agents FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_call_queue_updated_at BEFORE UPDATE ON public.call_queue FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_scheduling_rules_updated_at BEFORE UPDATE ON public.scheduling_rules FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_call_queue_scheduled_time ON public.call_queue(scheduled_time);
CREATE INDEX IF NOT EXISTS idx_call_queue_status ON public.call_queue(status);
CREATE INDEX IF NOT EXISTS idx_call_queue_lead_id ON public.call_queue(lead_id);
CREATE INDEX IF NOT EXISTS idx_call_recordings_call_id ON public.call_recordings(call_id);
CREATE INDEX IF NOT EXISTS idx_call_recordings_lead_id ON public.call_recordings(lead_id);
CREATE INDEX IF NOT EXISTS idx_ai_agent_performance_date ON public.ai_agent_performance(date);
