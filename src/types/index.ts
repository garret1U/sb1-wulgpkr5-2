import React, { useState, useMemo } from 'react';
import { MapPin, Plus, Edit2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Table } from '../components/ui/Table';
import { GridView } from '../components/ui/GridView';
import { ViewToggle } from '../components/ui/ViewToggle';
import { SearchBar } from '../components/ui/SearchBar';
import { FilterDropdown } from '../components/ui/FilterDropdown';
import { Modal } from '../components/ui/Modal';
import { LocationForm } from '../components/locations/LocationForm';
import { LocationEditForm } from '../components/locations/LocationEditForm';
import { LocationCard } from '../components/locations/LocationCard';
import { getLocations, getCompanies } from '../lib/api';
import type { Location } from '../types';

const getColumns = (onEdit: (location: Location) => void) => [
  { header: 'Name', accessorKey: 'name' },
  { header: 'Address', accessorKey: 'address' },
  { header: 'City', accessorKey: 'city' },
  { header: 'State', accessorKey: 'state' },
  { header: 'Country', accessorKey: 'country' },
  {
    header: 'Criticality',
    accessorKey: 'criticality',
    cell: (value: string) => {
      const colors = {
        High: 'text-red-500',
        Medium: 'text-yellow-500',
        Low: 'text-green-500'
      }[value] || 'text-gray-500';
      return <span className={colors}>{value}</span>;
    }
  },
  { 
    header: 'Company',
    accessorKey: 'company',
    cell: (value: any) => value?.name || 'N/A'
  },
  {
    header: '',
    accessorKey: 'id',
    cell: (_: string, row: Location) => (
      <button
        onClick={(e) => {
          e.stopPropagation();
          onEdit(row);
        }}
        className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        <Edit2 className="h-4 w-4 text-gray-400 hover:text-primary" />
      </button>
    )
  }
];

export function Locations() {
  const [view, setView] = useState<'grid' | 'table'>('grid');
  const [search, setSearch] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [criticalityFilter, setCriticalityFilter] = useState('');
  const [companyFilter, setCompanyFilter] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  
  const { data: locations, isLoading } = useQuery({
    queryKey: ['locations'],
    queryFn: () => getLocations({
      search,
      state: stateFilter,
      city: cityFilter,
      criticality: criticalityFilter,
      company_id: companyFilter
    })
  });

  const { data: companies } = useQuery({
    queryKey: ['companies'],
    queryFn: getCompanies
  });

  const filters = useMemo(() => {
    if (!locations) return { states: [], cities: [], companies: [] };

    const states = [...new Set(locations.map(l => l.state))].map(state => ({
      value: state,
      label: state
    }));

    const cities = [...new Set(locations.map(l => l.city))].map(city => ({
      value: city,
      label: city
    }));

    return { states, cities };
  }, [locations]);

  const companyOptions = useMemo(() => {
    return companies?.map(company => ({
      value: company.id,
      label: company.name
    })) || [];
  }, [companies]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4">
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
        >
          Add Location
        </button>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Location"
      >
        <LocationForm onClose={() => setIsModalOpen(false)} />
      </Modal>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        {isLoading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <Table data={locations || []} columns={columns} />
        )}
      </div>
    </div>
  );
}

export interface UserProfile {
  id: string;
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  role: 'admin' | 'viewer';
  created_at: string;
  updated_at: string;
}