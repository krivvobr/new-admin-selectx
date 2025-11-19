// Database types based on database.md schema

export type PropertyType = 'apartamento' | 'casa' | 'cobertura' | 'comercial' | 'terreno';
export type PropertyPurpose = 'venda' | 'locacao';
export type PropertyStatus = 'disponivel' | 'vendido' | 'alugado' | 'inativo';
export type LeadStatus = 'new' | 'contacted';
export type UserRole = 'admin' | 'agent' | 'viewer';

export interface Property {
  id: string;
  code: string;
  title: string;
  description?: string;
  type: PropertyType;
  purpose: PropertyPurpose;
  price: number;
  address?: string;
  area?: number;
  bedrooms?: number;
  bathrooms?: number;
  parking?: number;
  furnished?: boolean;
  financing?: boolean;
  floor?: number;
  status?: PropertyStatus;
  created_at?: string;
  updated_at?: string;
  city_id?: string;
  suites?: number;
  images?: string[];
  cover_image?: string;
}

export interface Lead {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  property_id?: string;
  status?: LeadStatus;
  created_at?: string;
  notes?: string;
  message?: string;
  property_url?: string;
}

export interface Profile {
  id: string;
  full_name?: string;
  phone?: string;
  role?: UserRole;
  created_at?: string;
}

export interface City {
  id: string;
  name: string;
  state: string;
  created_at?: string;
}

export interface Neighborhood {
  id: string;
  city_id: string;
  name: string;
  created_at?: string;
}

export interface Banner {
  id: string;
  title: string;
  desktop_images: string[];
  mobile_image?: string;
  active?: boolean;
  created_at?: string;
}

