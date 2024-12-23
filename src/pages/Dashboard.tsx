import React from 'react';
import { Activity, CircleDollarSign, Network, AlertCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { DashboardCard } from '../components/ui/DashboardCard';
import { getDashboardStats } from '../lib/api';

export function Dashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: getDashboardStats
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Dashboard</h1>
      
      {isLoading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Total Circuits"
          value={stats?.totalCircuits || 0}
          icon={<Network className="h-6 w-6" />}
        />
        <DashboardCard
          title="Active Circuits"
          value={stats?.activeCircuits || 0}
          icon={<Activity className="h-6 w-6" />}
        />
        <DashboardCard
          title="Inactive Circuits"
          value={stats?.inactiveCircuits || 0}
          icon={<AlertCircle className="h-6 w-6" />}
        />
        <DashboardCard
          title="Monthly Cost"
          value={`$${(stats?.totalMonthlyCost || 0).toLocaleString()}`}
          icon={<CircleDollarSign className="h-6 w-6" />}
        />
      </div>)}
    </div>
  );
}