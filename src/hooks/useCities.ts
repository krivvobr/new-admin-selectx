import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { City } from '../types';

export function useCities() {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCities = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('cities')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      setCities(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCities();
  }, []);

  const createCity = async (city: Omit<City, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('cities')
        .insert([city])
        .select()
        .single();

      if (error) throw error;
      await fetchCities();
      return { data, error: null };
    } catch (err: any) {
      return { data: null, error: err.message };
    }
  };

  const updateCity = async (id: string, updates: Partial<City>) => {
    try {
      const { data, error } = await supabase
        .from('cities')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      await fetchCities();
      return { data, error: null };
    } catch (err: any) {
      return { data: null, error: err.message };
    }
  };

  const deleteCity = async (id: string) => {
    try {
      const { error } = await supabase
        .from('cities')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchCities();
      return { error: null };
    } catch (err: any) {
      return { error: err.message };
    }
  };

  return {
    cities,
    loading,
    error,
    fetchCities,
    createCity,
    updateCity,
    deleteCity,
  };
}

