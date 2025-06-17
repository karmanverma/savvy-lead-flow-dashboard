
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Call {
  id: string;
  lead_id: string;
  agent_id?: string;
  ai_agent_id?: string;
  call_type: string;
  call_status: string;
  duration_seconds?: number;
  call_objective?: string;
  call_summary?: string;
  recording_url?: string;
  transcript?: string;
  lead_score_change?: number;
  next_action?: string;
  scheduled_for?: string;
  completed_at?: string;
  created_at: string;
  leads?: {
    first_name: string;
    last_name: string;
    phone: string;
  };
  ai_agents?: {
    name: string;
  };
}

export const useCalls = () => {
  return useQuery({
    queryKey: ['calls'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('calls')
        .select(`
          *,
          leads(first_name, last_name, phone),
          ai_agents(name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Call[];
    },
  });
};

export const useCreateCall = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (callData: any) => {
      const { data, error } = await supabase
        .from('calls')
        .insert(callData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calls'] });
      toast({
        title: "Success",
        description: "Call logged successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to log call",
        variant: "destructive",
      });
      console.error('Create call error:', error);
    },
  });
};
