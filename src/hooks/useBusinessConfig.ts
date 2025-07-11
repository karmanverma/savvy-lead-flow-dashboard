import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Campaign {
  id: string;
  name: string;
  description?: string;
  lead_source: string;
  default_agent_id?: string;
  is_active: boolean;
  business_config: any;
  created_at: string;
  updated_at: string;
  ai_agents?: {
    id: string;
    name: string;
  };
}

export interface BusinessConfiguration {
  id: string;
  business_name: string;
  industry: string;
  terminology: any;
  custom_fields: any[];
  call_objectives: string[];
  business_hours: any;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface GlobalSetting {
  id: string;
  setting_key: string;
  setting_value: any;
  description?: string;
  created_at: string;
  updated_at: string;
}

export const useCampaigns = () => {
  const queryClient = useQueryClient();
  
  const query = useQuery({
    queryKey: ['campaigns'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('campaigns')
        .select(`
          *,
          ai_agents (
            id,
            name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Campaign[];
    },
  });

  const refetch = () => {
    queryClient.invalidateQueries({ queryKey: ['campaigns'] });
  };

  return {
    ...query,
    refetch
  };
};

export const useCreateCampaign = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (campaignData: { name: string; lead_source: string; description?: string; default_agent_id?: string; business_config?: any; is_active?: boolean }) => {
      const { data, error } = await supabase
        .from('campaigns')
        .insert(campaignData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      toast({
        title: "Success",
        description: "Campaign created successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateCampaign = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Campaign> & { id: string }) => {
      const { data, error } = await supabase
        .from('campaigns')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      toast({
        title: "Success",
        description: "Campaign updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useBusinessConfiguration = () => {
  return useQuery({
    queryKey: ['business-configuration'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('business_configuration')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as BusinessConfiguration[];
    },
  });
};

export const useUpdateBusinessConfiguration = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<BusinessConfiguration> & { id: string }) => {
      const { data, error } = await supabase
        .from('business_configuration')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business-configuration'] });
      toast({
        title: "Success",
        description: "Business configuration updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useGlobalSettings = () => {
  return useQuery({
    queryKey: ['global-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('global_settings')
        .select('*')
        .order('setting_key');

      if (error) throw error;
      return data as GlobalSetting[];
    },
  });
};

export const useUpdateGlobalSetting = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ setting_key, setting_value }: { setting_key: string; setting_value: any }) => {
      const { data, error } = await supabase
        .from('global_settings')
        .update({ setting_value })
        .eq('setting_key', setting_key)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['global-settings'] });
      toast({
        title: "Success",
        description: "Setting updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};