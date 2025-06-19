
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface AIAgent {
  id: string;
  name: string;
  description?: string;
  is_active: boolean;
  voice_id?: string;
  voice_settings?: any;
  first_message_script: string;
  system_prompt: string;
  call_objectives?: string[];
  max_call_duration?: number;
  created_at: string;
  updated_at: string;
  elevenlabs_agent_id?: string;
  language?: string;
  phone_number?: string;
  conversation_config?: any;
  llm_config?: any;
  webhook_url?: string;
}

export const useAIAgents = () => {
  return useQuery({
    queryKey: ['ai-agents'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_agents')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as AIAgent[];
    },
  });
};
