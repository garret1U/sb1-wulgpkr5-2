import React, { useState } from 'react';
import { MapPin } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Table } from '../components/ui/Table';
import { Modal } from '../components/ui/Modal';
import { LocationForm } from '../components/locations/LocationForm';
import { getLocations } from '../lib/api';
import type { Location } from '../types';

const columns = [
  { header: 'Name', accessorKey: 'name' },
  { header: 'Address', accessorKey: 'address' },
  { header: 'City', accessorKey: 'city' },
  { header: 'State', accessorKey: 'state' },
  { header: 'Country', accessorKey: 'country' },
  { header: 'Criticality', accessorKey: 'criticality' },
  { 
    header: 'Company',
    accessorKey: 'company',
    cell: (value: any) => value?.name || 'N/A'
  }
];

export function Locations() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { data: locations, isLoading } = useQuery({
    queryKey: ['locations'],
    queryFn: getLocations
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <MapPin className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Locations</h1>
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