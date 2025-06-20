
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
      console.log('Creating ElevenLabs agent with data:', agentData);
      
      const { data, error } = await supabase.functions.invoke('elevenlabs-agent-create', {
        body: agentData
      });

      if (error) {
        console.error('Agent creation error:', error);
        throw error;
      }
      
      console.log('Agent creation response:', data);
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
      console.error('Create agent mutation error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create AI agent",
        variant: "destructive",
      });
    },
  });

  const initiateSecureCall = useMutation({
    mutationFn: async (params: {
      lead_id: string;
      ai_agent_id: string;
      call_objective: string;
      priority?: number;
    }) => {
      console.log('Initiating secure call with params:', params);
      
      const { data, error } = await supabase.functions.invoke('elevenlabs-call-initiate', {
        body: params
      });

      if (error) {
        console.error('Call initiation error:', error);
        throw error;
      }
      
      console.log('Call initiation response:', data);
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
      console.error('Call initiation mutation error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to initiate call",
        variant: "destructive",
      });
    },
  });

  const getVoices = useQuery({
    queryKey: ['elevenlabs-voices'],
    queryFn: async () => {
      console.log('Fetching ElevenLabs voices...');
      
      // Use GET request for the voices endpoint (no body needed)
      const { data, error } = await supabase.functions.invoke('elevenlabs-voices');
      
      if (error) {
        console.error('Voices fetch error:', error);
        throw error;
      }
      
      console.log('Voices response:', data);
      return data;
    },
    staleTime: 1000 * 60 * 60, // 1 hour
    retry: 3,
    retryDelay: 1000,
  });

  const testVoice = useMutation({
    mutationFn: async (voiceId: string) => {
      console.log('Testing voice with ID:', voiceId);
      
      try {
        // Use the ElevenLabs API directly for voice testing with proper headers
        const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
          method: 'POST',
          headers: {
            'xi-api-key': 'sk_3916f6f66157e20925991c16f906e8984d1219f3f0be85ab',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: "Hello, this is a test of my voice. I'm an AI agent ready to help with your real estate needs.",
            model_id: 'eleven_multilingual_v2',
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.5,
            },
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Voice test API error:', response.status, errorText);
          throw new Error(`Voice test failed: ${response.status} - ${errorText}`);
        }

        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        
        return new Promise<void>((resolve, reject) => {
          audio.onended = () => {
            URL.revokeObjectURL(audioUrl);
            console.log('Voice test completed successfully');
            resolve();
          };
          audio.onerror = (e) => {
            URL.revokeObjectURL(audioUrl);
            console.error('Audio playback error:', e);
            reject(new Error('Failed to play audio'));
          };
          audio.play().catch((e) => {
            console.error('Audio play error:', e);
            reject(e);
          });
        });
      } catch (error) {
        console.error('Voice test error:', error);
        throw error;
      }
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Voice test completed successfully",
      });
    },
    onError: (error) => {
      console.error('Voice test mutation error:', error);
      toast({
        title: "Error",
        description: "Failed to test voice",
        variant: "destructive",
      });
    },
  });

  return {
    createElevenLabsAgent,
    initiateSecureCall,
    testVoice,
    getVoices,
  };
};
