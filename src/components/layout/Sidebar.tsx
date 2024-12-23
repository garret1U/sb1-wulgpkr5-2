import React from 'react';
import { Home, Building2, Network, MapPin } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Companies', href: '/companies', icon: Building2 },
  { name: 'Locations', href: '/locations', icon: MapPin },
  { name: 'Circuits', href: '/circuits', icon: Network }
];

interface SidebarProps {
  isOpen: boolean;
}

export function Sidebar({ isOpen }: SidebarProps) {
  const location = useLocation();

  return (
    <aside
      className={`
        flex flex-col z-50 min-h-0
        w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
        transform transition-transform duration-200 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0
      `}
    >
      <div className="h-16 flex items-center justify-center border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">ISP Circuit Setup</h1>
      </div>
      
      <nav className="flex-1 mt-4 overflow-y-auto">
        <ul className="space-y-1 px-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;
            
            return (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className={`
                    flex items-center px-4 py-2 text-sm rounded-md
                    ${
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }
                  `}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}