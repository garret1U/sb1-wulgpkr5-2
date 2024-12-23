import { supabase } from './supabase';
import type { Company, Location, Circuit } from '../types';

interface CompanyFilters {
  search?: string;
  state?: string;
  city?: string;
}

// Companies
export async function getCompanies(filters?: CompanyFilters) {
  let query = supabase.from('companies').select('*');

  if (filters?.search) {
    query = query.or(`name.ilike.%${filters.search}%,city.ilike.%${filters.search}%,state.ilike.%${filters.search}%`);
  }
  
  if (filters?.state) {
    query = query.eq('state', filters.state);
  }
  
  if (filters?.city) {
    query = query.eq('city', filters.city);
  }

  const { data, error } = await query.order('name');
  
  if (error) throw error;
  return data;
}

export async function getCompany(id: string) {
  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
}

export async function createCompany(company: CompanyFormData) {
  const { data, error } = await supabase
    .from('companies')
    .insert([company])
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

// Locations
export async function getLocations() {
  const { data, error } = await supabase
    .from('locations')
    .select(`
      *,
      company:companies(name)
    `)
    .order('name');
  
  if (error) throw error;
  return data;
}

export async function getLocation(id: string) {
  const { data, error } = await supabase
    .from('locations')
    .select(`
      *,
      company:companies(*)
    `)
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
}

export async function createLocation(location: Omit<Location, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('locations')
    .insert([location])
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

// Circuits
export async function getCircuits() {
  const { data, error } = await supabase
    .from('circuits')
    .select(`
      *,
      location:locations(
        name,
        company:companies(name)
      )
    `)
    .order('carrier');
  
  if (error) throw error;
  return data;
}

export async function getCircuit(id: string) {
  const { data, error } = await supabase
    .from('circuits')
    .select(`
      *,
      location:locations(
        *,
        company:companies(*)
      )
    `)
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateUserProfile(data: {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  address?: string;
}) {
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError) throw authError;
  if (!user) throw new Error('No authenticated user');

  const { data: profile, error } = await supabase
    .from('user_profiles')
    .update({
      ...data,
      updated_at: new Date().toISOString()
    })
    .eq('user_id', user.id)
    .select()
    .single();
  
  if (error) throw error;
  return profile;
}

// Dashboard Stats
export async function getDashboardStats() {
  const { data: circuits, error } = await supabase
    .from('circuits')
    .select('status, monthlycost');
  
  if (error) throw error;

  const totalCircuits = circuits.length;
  const activeCircuits = circuits.filter(c => c.status === 'Active').length;
  const inactiveCircuits = circuits.filter(c => c.status === 'Inactive').length;
  const totalMonthlyCost = circuits.reduce((sum, c) => sum + (c.monthlycost || 0), 0);

  return {
    totalCircuits,
    activeCircuits,
    inactiveCircuits,
    totalMonthlyCost
  };
}

export async function getCurrentUserProfile() {
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError) throw authError;
  if (!user) throw new Error('No authenticated user');

  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();
  
  if (error) {
    console.error('Error fetching user profile:', error);
    throw new Error('Failed to fetch user profile');
  }

  if (!data) {
    // Create profile for new user
    const { data: newProfile, error: createError } = await supabase
      .from('user_profiles')
      .insert([{ user_id: user.id, role: 'viewer' }])
      .select()
      .single();
    
    if (createError) {
      console.error('Error creating user profile:', createError);
      throw new Error('Failed to create user profile');
    }
    
    return newProfile;
  }

  return data;
}

// Get all user profiles (admin-only)
export async function getUserProfiles() {
  const { data, error } = await supabase
    .from('user_profiles')
    .select(`
      *,
      user:auth.users!user_id(
        email,
        last_sign_in_at
      )
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

// Update user role (admin-only)
export async function updateUserRole(userId: string, role: 'admin' | 'viewer') {
  const { data, error } = await supabase
    .from('user_profiles')
    .update({ role })
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
