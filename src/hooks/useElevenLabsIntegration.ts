
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { elevenLabsClient } from '@/lib/elevenlabs-client';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useElevenLabsIntegration = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createElevenLabsAgent = useMutation({
    mutationFn: async (agentData: {
      name: string;
      voice_id: string;
      system_prompt: string;
      first_message_script: string;
      language?: string;
    }) => {
      // Create agent in ElevenLabs
      const elevenLabsAgent = await elevenLabsClient.createAgent({
        name: agentData.name,
        voice_id: agentData.voice_id,
        prompt: agentData.system_prompt,
        first_message: agentData.first_message_script,
        language: agentData.language || 'en',
      });

      // Update our database with the ElevenLabs agent ID
      const { data, error } = await supabase
        .from('ai_agents')
        .insert({
          name: agentData.name,
          voice_id: agentData.voice_id,
          system_prompt: agentData.system_prompt,
          first_message_script: agentData.first_message_script,
          language: agentData.language || 'en',
          elevenlabs_agent_id: elevenLabsAgent.agent_id,
          is_active: true,
        })
        .select()
        .single();

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
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create AI agent",
        variant: "destructive",
      });
      console.error('Create agent error:', error);
    },
  });

  const initiateElevenLabsCall = useMutation({
    mutationFn: async (params: {
      agentId: string;
      phoneNumber: string;
      customerName?: string;
    }) => {
      // Get the ElevenLabs agent ID from our database
      const { data: agent } = await supabase
        .from('ai_agents')
        .select('elevenlabs_agent_id')
        .eq('id', params.agentId)
        .single();

      if (!agent?.elevenlabs_agent_id) {
        throw new Error('Agent not synced with ElevenLabs');
      }

      // Initiate the call through ElevenLabs
      const callResponse = await elevenLabsClient.initiateCall({
        agent_id: agent.elevenlabs_agent_id,
        customer_phone_number: params.phoneNumber,
        customer_name: params.customerName,
      });

      return callResponse;
    },
    onSuccess: () => {
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
      console.error('Call initiation error:', error);
    },
  });

  const testVoice = useMutation({
    mutationFn: async (voiceId: string) => {
      const audioBuffer = await elevenLabsClient.testVoice(voiceId);
      
      // Play the audio
      const audioBlob = new Blob([audioBuffer], { type: 'audio/mpeg' });
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

  const getVoices = useQuery({
    queryKey: ['elevenlabs-voices'],
    queryFn: () => elevenLabsClient.getVoices(),
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  return {
    createElevenLabsAgent,
    initiateElevenLabsCall,
    testVoice,
    getVoices,
  };
};
