import React from 'react';
import { Network } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Table } from '../components/ui/Table';
import { getCircuits } from '../lib/api';
import type { Circuit } from '../types';

const columns = [
  { header: 'Carrier', accessorKey: 'carrier' },
  { header: 'Type', accessorKey: 'type' },
  { header: 'Status', accessorKey: 'status' },
  { header: 'Bandwidth', accessorKey: 'bandwidth' },
  { 
    header: 'Monthly Cost',
    accessorKey: 'monthlycost',
    cell: (value: number) => `$${value.toLocaleString()}`
  },
  {
    header: 'Location',
    accessorKey: 'location',
    cell: (value: any) => `${value.name} (${value.company.name})`
  }
];

export function Circuits() {
  const { data: circuits, isLoading } = useQuery({
    queryKey: ['circuits'],
    queryFn: getCircuits
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Network className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Circuits</h1>
        </div>
        <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90">
          Add Circuit
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        {isLoading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <Table data={circuits || []} columns={columns} />
        )}
      </div>
    </div>
  );
}