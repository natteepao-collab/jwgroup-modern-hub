import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface BusinessType {
  id: string;
  business_key: string;
  name_th: string;
  name_en: string | null;
  icon_name: string | null;
  color: string | null;
  position_order: number | null;
  is_active: boolean | null;
  created_at: string;
  updated_at: string;
}

export const useBusinessTypes = () => {
  return useQuery({
    queryKey: ['business-types'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('business_types')
        .select('*')
        .eq('is_active', true)
        .order('position_order', { ascending: true });
      
      if (error) throw error;
      return data as BusinessType[];
    },
  });
};

export const useAllBusinessTypes = () => {
  return useQuery({
    queryKey: ['business-types-all'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('business_types')
        .select('*')
        .order('position_order', { ascending: true });
      
      if (error) throw error;
      return data as BusinessType[];
    },
  });
};

export const useUpdateBusinessType = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<BusinessType> }) => {
      const { data, error } = await supabase
        .from('business_types')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business-types'] });
      queryClient.invalidateQueries({ queryKey: ['business-types-all'] });
      toast.success('บันทึกข้อมูลเรียบร้อย');
    },
    onError: (error) => {
      toast.error('เกิดข้อผิดพลาด: ' + error.message);
    },
  });
};
