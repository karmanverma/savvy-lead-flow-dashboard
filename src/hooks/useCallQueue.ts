
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface QueuedCall {
  id: string;
  lead_id: string;
  ai_agent_id: string;
  scheduled_time: string;
  call_objective: string;
  priority: number;
  status: 'scheduled' | 'in_progress' | 'completed' | 'failed' | 'cancelled';
  custom_context: any;
  retry_count: number;
  max_retries: number;
  created_by?: string;
  created_at: string;
  updated_at: string;
  executed_at?: string;
  leads?: {
    first_name: string;
    last_name: string;
    phone: string;
  };
  ai_agents?: {
    name: string;
    voice_id?: string;
  };
}

export const useCallQueue = () => {
  return useQuery({
    queryKey: ['call-queue'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('call_queue')
        .select(`
          *,
          leads(first_name, last_name, phone),
          ai_agents(name, voice_id)
        `)
        .order('scheduled_time', { ascending: true });

      if (error) throw error;
      return data as QueuedCall[];
    },
  });
};

export const useScheduleCall = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (callData: {
      lead_id: string;
      ai_agent_id: string;
      scheduled_time: string;
      call_objective: string;
      priority?: number;
      custom_context?: any;
    }) => {
      const { data, error } = await supabase
        .from('call_queue')
        .insert(callData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['call-queue'] });
      toast({
        title: "Success",
        description: "Call scheduled successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to schedule call",
        variant: "destructive",
      });
      console.error('Schedule call error:', error);
    },
  });
};

export const useUpdateCallStatus = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, status, executed_at }: { 
      id: string; 
      status: QueuedCall['status']; 
      executed_at?: string;
    }) => {
      const { data, error } = await supabase
        .from('call_queue')
        .update({ status, executed_at })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['call-queue'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update call status",
        variant: "destructive",
      });
      console.error('Update call status error:', error);
    },
  });
};
