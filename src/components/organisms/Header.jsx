import { NavLink, Link } from "react-router-dom";
import React, { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
const navItems = [
    { path: '/', label: 'Dashboard', icon: 'LayoutDashboard' },
    { path: '/patients', label: 'Patients', icon: 'Users' },
    { path: '/appointments', label: 'Appointments', icon: 'Calendar' },
    { path: '/prescriptions', label: 'Prescriptions', icon: 'FileText' },
    { path: '/doctors', label: 'Doctors', icon: 'Stethoscope' },
    { path: '/invoices', label: 'Invoices', icon: 'Receipt' },
    { path: '/staff', label: 'Staff', icon: 'UserCog' },
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
              <ApperIcon name="Heart" size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">MediFlow</h1>
              <p className="text-xs text-gray-600">Healthcare Management</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                <ApperIcon name={item.icon} size={18} />
                {item.label}
              </NavLink>
            ))}
</nav>

          {/* Search Bar (Desktop) */}

          {/* User Actions */}
          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <ApperIcon name="Bell" size={20} />
            </button>
            <button className="flex items-center gap-2 p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <ApperIcon name="User" size={20} />
            </button>
            
            {/* Mobile Menu Button */}
            <div className="md:hidden ml-2">
              <Button
                variant="ghost"
                size="sm"
                icon={isMobileMenuOpen ? "X" : "Menu"}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              />
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
{navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                      isActive
                        ? "text-primary bg-blue-50"
                        : "text-gray-600 hover:text-primary hover:bg-gray-50"
                    }`
                  }
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <ApperIcon name={item.icon} size={18} />
                  <span>{item.label}</span>
</NavLink>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
);
}

export default Header;