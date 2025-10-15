import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Staff from "@/components/pages/Staff";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: "Dashboard", path: "/", icon: "LayoutDashboard" },
    { name: "Patients", path: "/patients", icon: "Users" },
    { name: "Appointments", path: "/appointments", icon: "Calendar" },
    { name: "Staff", path: "/staff", icon: "UserCheck" }
  ];

  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
<div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                <ApperIcon name="Activity" size={20} className="text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                HealthCare
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isActive(item.path)
                    ? "text-primary bg-blue-50"
                    : "text-gray-600 hover:text-primary hover:bg-gray-50"
                }`}
              >
                <ApperIcon name={item.icon} size={16} />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* Search Bar (Desktop) */}
          <div className="hidden lg:block">
            <SearchBar
              placeholder="Search patients, appointments..."
              onSearch={(query) => console.log("Search:", query)}
              className="w-64"
            />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              icon={isMobileMenuOpen ? "X" : "Menu"}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                    isActive(item.path)
                      ? "text-primary bg-blue-50"
                      : "text-gray-600 hover:text-primary hover:bg-gray-50"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <ApperIcon name={item.icon} size={18} />
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
            {/* Mobile Search */}
            <div className="px-4 pb-4">
              <SearchBar
                placeholder="Search patients, appointments..."
                onSearch={(query) => console.log("Search:", query)}
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;