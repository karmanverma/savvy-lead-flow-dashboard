
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useSecureElevenLabsIntegration = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createElevenLabsAgent = useMutation({
    mutationFn: async (agentData: {
      name: string;
      description?: string;
      system_prompt: string;
      first_message_script: string;
      voice_id: string;
      voice_settings?: any;
      llm_config?: any;
      max_call_duration?: number;
      language?: string;
      call_objectives?: string[];
    }) => {
      const { data, error } = await supabase.functions.invoke('elevenlabs-agent-create', {
        body: agentData
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-agents'] });
      toast({
        title: "Success",
        description: "AI Agent created and synced with ElevenLabs",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create AI agent",
        variant: "destructive",
      });
      console.error('Create agent error:', error);
    },
  });

  const initiateSecureCall = useMutation({
    mutationFn: async (params: {
      lead_id: string;
      ai_agent_id: string;
      call_objective: string;
      priority?: number;
    }) => {
      const { data, error } = await supabase.functions.invoke('elevenlabs-call-initiate', {
        body: params
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['call-queue'] });
      toast({
        title: "Success",
        description: "AI call initiated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to initiate call",
        variant: "destructive",
      });
      console.error('Call initiation error:', error);
    },
  });

  const getVoices = useQuery({
    queryKey: ['elevenlabs-voices'],
    queryFn: async () => {
      // Use GET request with no body for the voices endpoint
      const { data, error } = await supabase.functions.invoke('elevenlabs-voices', {
        method: 'GET'
      });
      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  const testVoice = useMutation({
    mutationFn: async (voiceId: string) => {
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
          'xi-api-key': 'sk_3916f6f66157e20925991c16f906e8984d1219f3f0be85ab',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: "Hello, this is a test of my voice.",
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Voice test failed: ${response.status}`);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      return new Promise<void>((resolve, reject) => {
        audio.onended = () => {
          URL.revokeObjectURL(audioUrl);
          resolve();
        };
        audio.onerror = () => {
          URL.revokeObjectURL(audioUrl);
          reject(new Error('Failed to play audio'));
        };
        audio.play().catch(reject);
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to test voice",
        variant: "destructive",
      });
      console.error('Voice test error:', error);
    },
  });

  return {
    createElevenLabsAgent,
    initiateSecureCall,
    testVoice,
    getVoices,
  };
};
