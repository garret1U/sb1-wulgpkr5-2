import React, { useState } from 'react';
import { Building2, Plus } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Table } from '../components/ui/Table';
import { GridView } from '../components/ui/GridView';
import { ViewToggle } from '../components/ui/ViewToggle';
import { SearchBar } from '../components/ui/SearchBar';
import { FilterDropdown } from '../components/ui/FilterDropdown';
import { Modal } from '../components/ui/Modal';
import { CompanyForm } from '../components/companies/CompanyForm';
import { CompanyCard } from '../components/companies/CompanyCard';
import { getCompanies } from '../lib/api';
import type { Company } from '../types';

const columns = [
  { header: 'Name', accessorKey: 'name' },
  { header: 'City', accessorKey: 'city' },
  { header: 'State', accessorKey: 'state' },
  { header: 'Phone', accessorKey: 'phone' },
  { header: 'Email', accessorKey: 'email' }
];

export function Companies() {
  const [view, setView] = useState<'grid' | 'table'>('grid');
  const [search, setSearch] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: companies, isLoading } = useQuery({
    queryKey: ['companies'],
    queryFn: () => getCompanies({ search, state: stateFilter, city: cityFilter })
  });

  // Get unique states and cities for filters
  const states = React.useMemo(() => {
    if (!companies) return [];
    const uniqueStates = [...new Set(companies.map(c => c.state))];
    return uniqueStates.map(state => ({ value: state, label: state }));
  }, [companies]);

  const cities = React.useMemo(() => {
    if (!companies) return [];
    const uniqueCities = [...new Set(companies.map(c => c.city))];
    return uniqueCities.map(city => ({ value: city, label: city }));
  }, [companies]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Building2 className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Companies</h1>
          </div>
          <div className="flex items-center space-x-4">
            <ViewToggle view={view} onViewChange={setView} />
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90
                       flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Add Company</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex-1">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search companies..."
            />
          </div>
          <div className="flex space-x-4">
            <FilterDropdown
              value={stateFilter}
              onChange={setStateFilter}
              options={states}
              label="All States"
            />
            <FilterDropdown
              value={cityFilter}
              onChange={setCityFilter}
              options={cities}
              label="All Cities"
            />
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Company"
      >
        <CompanyForm onClose={() => setIsModalOpen(false)} />
      </Modal>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        {isLoading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          view === 'table' ? (
            <Table data={companies || []} columns={columns} />
          ) : (
            <GridView
              data={companies || []}
              renderCard={(company) => <CompanyCard company={company} />}
            />
          )
        )}
      </div>
    </div>
  );
}