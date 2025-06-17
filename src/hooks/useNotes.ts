
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Note {
  id: string;
  lead_id: string;
  author_id?: string;
  author_type: string;
  content: string;
  note_type: string;
  is_private: boolean;
  created_at: string;
  updated_at: string;
}

export const useNotes = (leadId: string) => {
  return useQuery({
    queryKey: ['notes', leadId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('lead_id', leadId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Note[];
    },
    enabled: !!leadId,
  });
};

export const useCreateNote = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (noteData: { lead_id: string; content: string; note_type?: 'general' | 'call_summary' | 'follow_up' | 'qualification' }) => {
      const { data, error } = await supabase
        .from('notes')
        .insert({
          lead_id: noteData.lead_id,
          content: noteData.content,
          author_type: 'agent',
          note_type: noteData.note_type || 'general',
          is_private: false,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['notes', data.lead_id] });
      toast({
        title: "Success",
        description: "Note added successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add note",
        variant: "destructive",
      });
      console.error('Create note error:', error);
    },
  });
};
