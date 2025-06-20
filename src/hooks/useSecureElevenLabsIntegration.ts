
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
      voice_id?: string;
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
      
      try {
        const { data, error } = await supabase.functions.invoke('elevenlabs-voices', {
          method: 'GET'
        });
        
        if (error) {
          console.error('Voices fetch error from edge function:', error);
          throw new Error(`Failed to fetch voices: ${error.message}`);
        }
        
        console.log('Voices response from edge function:', data);
        return data;
      } catch (error) {
        console.error('Voices fetch error:', error);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 60, // 1 hour
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const testVoice = useMutation({
    mutationFn: async (voiceId: string) => {
      console.log('Testing voice with ID:', voiceId);
      
      try {
        const { data, error } = await supabase.functions.invoke('elevenlabs-voices', {
          method: 'POST',
          body: { 
            action: 'test_voice',
            voice_id: voiceId,
            text: "Hello, this is a test of my voice. I'm an AI agent ready to help with your real estate needs."
          }
        });

        if (error) {
          console.error('Voice test error from edge function:', error);
          throw new Error(`Voice test failed: ${error.message}`);
        }

        // If we get audio data back, play it
        if (data && data.audio_data) {
          const audioBlob = new Blob([
            new Uint8Array(atob(data.audio_data).split('').map(c => c.charCodeAt(0)))
          ], { type: data.content_type || 'audio/mpeg' });
          
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
              URL.revokeObjectURL(audioUrl);
              console.error('Audio play error:', e);
              reject(e);
            });
          });
        } else {
          console.log('Voice test completed (no audio returned)');
        }
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
