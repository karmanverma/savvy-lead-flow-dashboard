-- Add campaigns table for lead source and agent assignment management
CREATE TABLE public.campaigns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  lead_source TEXT NOT NULL,
  default_agent_id UUID REFERENCES public.ai_agents(id),
  is_active BOOLEAN NOT NULL DEFAULT true,
  business_config JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add business_configuration table for industry-specific settings
CREATE TABLE public.business_configuration (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_name TEXT NOT NULL,
  industry TEXT NOT NULL,
  terminology JSONB DEFAULT '{}'::jsonb,
  custom_fields JSONB DEFAULT '[]'::jsonb,
  call_objectives JSONB DEFAULT '[]'::jsonb,
  business_hours JSONB DEFAULT '{}'::jsonb,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add global_settings table for system-wide configurations
CREATE TABLE public.global_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value JSONB NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add campaign_id to leads table for tracking lead sources
ALTER TABLE public.leads ADD COLUMN campaign_id UUID REFERENCES public.campaigns(id);

-- Add custom_data column to leads for dynamic fields
ALTER TABLE public.leads ADD COLUMN custom_data JSONB DEFAULT '{}'::jsonb;

-- Add override_agent_id to leads for lead-specific agent assignments
ALTER TABLE public.leads ADD COLUMN override_agent_id UUID REFERENCES public.ai_agents(id);

-- Enable RLS on new tables
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_configuration ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.global_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can access all campaigns data" ON public.campaigns FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Users can access all business_configuration data" ON public.business_configuration FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Users can access all global_settings data" ON public.global_settings FOR ALL USING (true) WITH CHECK (true);

-- Create triggers for updated_at
CREATE TRIGGER update_campaigns_updated_at
  BEFORE UPDATE ON public.campaigns
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_business_configuration_updated_at
  BEFORE UPDATE ON public.business_configuration
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_global_settings_updated_at
  BEFORE UPDATE ON public.global_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default global settings
INSERT INTO public.global_settings (setting_key, setting_value, description) VALUES 
('default_agent_id', '""', 'Global default AI agent ID for new leads'),
('business_hours', '{"monday": {"start": "09:00", "end": "17:00"}, "tuesday": {"start": "09:00", "end": "17:00"}, "wednesday": {"start": "09:00", "end": "17:00"}, "thursday": {"start": "09:00", "end": "17:00"}, "friday": {"start": "09:00", "end": "17:00"}, "saturday": null, "sunday": null}', 'Default business hours for call scheduling'),
('max_daily_calls', '100', 'Maximum number of calls per day'),
('call_retry_limit', '3', 'Maximum number of retry attempts for failed calls');

-- Insert default business configuration
INSERT INTO public.business_configuration (
  business_name, 
  industry, 
  terminology, 
  custom_fields, 
  call_objectives,
  is_default
) VALUES (
  'Default Business',
  'general',
  '{"lead": "lead", "prospect": "prospect", "client": "client", "appointment": "appointment"}',
  '[{"name": "priority", "type": "select", "options": ["High", "Medium", "Low"], "required": false}]',
  '["Initial Contact", "Qualification", "Follow-up", "Appointment Setting", "Closing"]',
  true
);