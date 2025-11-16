import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Neighborhood } from '../types';

export function useNeighborhoods() {
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNeighborhoods = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('neighborhoods')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      setNeighborhoods(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNeighborhoods();
  }, []);

  const createNeighborhood = async (neighborhood: Omit<Neighborhood, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('neighborhoods')
        .insert([neighborhood])
        .select()
        .single();

      if (error) throw error;
      await fetchNeighborhoods();
      return { data, error: null };
    } catch (err: any) {
      return { data: null, error: err.message };
    }
  };

  const updateNeighborhood = async (id: string, updates: Partial<Neighborhood>) => {
    try {
      const { data, error } = await supabase
        .from('neighborhoods')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      await fetchNeighborhoods();
      return { data, error: null };
    } catch (err: any) {
      return { data: null, error: err.message };
    }
  };

  const deleteNeighborhood = async (id: string) => {
    try {
      const { error } = await supabase
        .from('neighborhoods')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchNeighborhoods();
      return { error: null };
    } catch (err: any) {
      return { error: err.message };
    }
  };

  return {
    neighborhoods,
    loading,
    error,
    fetchNeighborhoods,
    createNeighborhood,
    updateNeighborhood,
    deleteNeighborhood,
  };
}

