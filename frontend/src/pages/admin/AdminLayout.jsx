import React from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LayoutDashboard, Users, MessageSquare, Package, LogOut } from 'lucide-react';

const AdminLayout = () => {
  const { adminUser, adminLogout } = useAuth();
  const location = useLocation();

  if (!adminUser) {
    return <Navigate to="/admin/login" replace />;
  }

  const navItems = [
    { path: '/admin/wholesale', icon: Users, label: 'Wholesale Approvals' },
    { path: '/admin/messages', icon: MessageSquare, label: 'Messages' },
    { path: '/admin/products', icon: Package, label: 'Products' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0A1F44] text-white min-h-screen fixed left-0 top-0 flex flex-col">
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-2xl font-bold">GIVORA <span className="text-[#C9A227] text-sm block">Admin</span></h1>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded transition-colors ${location.pathname === item.path
                ? 'bg-[#C9A227] text-[#0A1F44] font-semibold'
                : 'text-gray-300 hover:bg-gray-800'
                }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center justify-between mb-4 px-4">
            <span className="text-xs text-gray-400">{adminUser?.email || 'Admin'}</span>
          </div>
          <button
            onClick={adminLogout}
            className="flex items-center space-x-3 px-4 py-2 text-red-400 hover:text-red-300 hover:bg-gray-800 rounded w-full"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;