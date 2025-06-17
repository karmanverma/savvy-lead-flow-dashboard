
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Lead {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  lead_source: string;
  status: string;
  lead_score: number;
  assigned_agent_id?: string;
  created_at: string;
  updated_at: string;
  lead_preferences?: {
    budget_min?: number;
    budget_max?: number;
    bedrooms_min?: number;
    bedrooms_max?: number;
    bathrooms_min?: number;
    property_types?: string[];
    preferred_areas?: string[];
    move_timeline?: string;
    special_requirements?: string;
  };
  lead_qualification?: {
    pre_approval_status?: string;
    current_situation?: string;
    family_size?: number;
    income_range?: string;
    down_payment_amount?: number;
  };
}

export const useLeads = () => {
  return useQuery({
    queryKey: ['leads'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leads')
        .select(`
          *,
          lead_preferences(*),
          lead_qualification(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Lead[];
    },
  });
};

export const useCreateLead = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (leadData: any) => {
      const { data: lead, error: leadError } = await supabase
        .from('leads')
        .insert({
          first_name: leadData.firstName,
          last_name: leadData.lastName,
          email: leadData.email,
          phone: leadData.phone,
          lead_source: leadData.source || 'website',
        })
        .select()
        .single();

      if (leadError) throw leadError;

      // Create preferences if provided
      if (leadData.budget || leadData.propertyType) {
        const { error: prefError } = await supabase
          .from('lead_preferences')
          .insert({
            lead_id: lead.id,
            budget_min: leadData.budget ? parseInt(leadData.budget.split('-')[0].replace(/[^0-9]/g, '')) : null,
            budget_max: leadData.budget ? parseInt(leadData.budget.split('-')[1]?.replace(/[^0-9]/g, '')) : null,
            property_types: leadData.propertyType ? [leadData.propertyType] : null,
          });

        if (prefError) console.error('Error creating preferences:', prefError);
      }

      // Create qualification if provided
      const { error: qualError } = await supabase
        .from('lead_qualification')
        .insert({
          lead_id: lead.id,
          pre_approval_status: 'unknown',
        });

      if (qualError) console.error('Error creating qualification:', qualError);

      return lead;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      toast({
        title: "Success",
        description: "Lead created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create lead",
        variant: "destructive",
      });
      console.error('Create lead error:', error);
    },
  });
};
