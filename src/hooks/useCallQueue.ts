
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
  status: string;
  custom_context?: any;
  elevenlabs_call_id?: string;
  leads?: {
    first_name: string;
    last_name: string;
    phone: string;
  };
  ai_agents?: {
    name: string;
    elevenlabs_agent_id?: string;
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
          ai_agents(name, elevenlabs_agent_id)
        `)
        .order('priority', { ascending: true })
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
        .insert({
          ...callData,
          priority: callData.priority || 3,
          status: 'scheduled'
        })
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

export const useInitiateCall = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (callData: {
      lead_id: string;
      ai_agent_id: string;
      call_objective: string;
      priority?: number;
    }) => {
      // Schedule immediate call (current time)
      const { data, error } = await supabase
        .from('call_queue')
        .insert({
          ...callData,
          scheduled_time: new Date().toISOString(),
          priority: callData.priority || 1,
          status: 'scheduled'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['call-queue'] });
      queryClient.invalidateQueries({ queryKey: ['calls'] });
      toast({
        title: "Success",
        description: "AI call initiated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to initiate call",
        variant: "destructive",
      });
      console.error('Initiate call error:', error);
    },
  });
};
