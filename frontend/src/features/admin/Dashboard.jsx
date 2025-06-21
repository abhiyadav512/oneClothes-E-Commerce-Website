// components/Dashboard.tsx
import React, { useState } from 'react';
import { Users, Package, ShoppingCart } from 'lucide-react';
import DashboardHome from './DashboardHome';
import Products from './ProductManagement';
import Orders from './OrdersManagement';
import Customers from './CustomersManagement';


const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'customers', label: 'Customers', icon: Users },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardHome />;
      case 'products':
        return <Products />;
      case 'orders':
        return <Orders />;
      case 'customers':
        return <Customers />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-6 py-4 sticky top-0 z-10">
        {/* Desktop Tabs */}
        <nav className="hidden md:flex space-x-1">
          {tabs.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === item.id
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
            >
              {item.icon && <item.icon className="mr-2 h-4 w-4" />}
              {item.label}
            </button>
          ))}
        </nav>

        {/* Mobile Tabs */}
        <nav className="md:hidden mt-4 flex overflow-x-auto space-x-1 pb-2">
          {tabs.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${activeTab === item.id
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
            >
              {item.icon && <item.icon className="mr-2 h-4 w-4" />}
              {item.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="p-6">{renderTabContent()}</main>
    </div>
  );
};

export default Dashboard;
