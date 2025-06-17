
import { useQuery } from '@tanstack/react-query';
import { elevenLabsService, Voice } from '@/services/elevenLabsService';

export const useVoices = () => {
  return useQuery({
    queryKey: ['voices'],
    queryFn: () => elevenLabsService.getVoices(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useVoice = (voiceId: string) => {
  return useQuery({
    queryKey: ['voice', voiceId],
    queryFn: () => elevenLabsService.getVoice(voiceId),
    enabled: !!voiceId,
  });
};
