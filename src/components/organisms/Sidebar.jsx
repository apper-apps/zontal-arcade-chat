import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { path: "/admin", icon: "LayoutDashboard", label: "Dashboard", exact: true },
    { path: "/admin/games", icon: "Gamepad2", label: "Games" },
    { path: "/admin/categories", icon: "Grid3x3", label: "Categories" },
    { path: "/admin/blog", icon: "FileText", label: "Blog" },
    { path: "/admin/ads", icon: "DollarSign", label: "Ads" },
    { path: "/admin/settings", icon: "Settings", label: "Settings" },
  ];

  const isActiveLink = (path, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  // Mobile Sidebar
  const MobileSidebar = () => (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed left-0 top-0 h-full w-64 bg-surface border-r border-gray-700 z-50 lg:hidden"
          >
            <SidebarContent onItemClick={onClose} />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  // Desktop Sidebar
  const DesktopSidebar = () => (
    <div className="hidden lg:block w-64 bg-surface border-r border-gray-700 h-full">
      <SidebarContent />
    </div>
  );

  const SidebarContent = ({ onItemClick }) => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
            <ApperIcon name="Gamepad2" size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold gradient-text">Zontal</h1>
            <p className="text-sm text-gray-400">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onItemClick}
            className={({ isActive }) =>
              cn(
                "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group",
                isActive || isActiveLink(item.path, item.exact)
                  ? "bg-gradient-to-r from-primary/20 to-secondary/20 text-primary border border-primary/30"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              )
            }
          >
            <ApperIcon 
              name={item.icon} 
              size={20} 
              className={cn(
                "transition-colors",
                isActiveLink(item.path, item.exact) 
                  ? "text-primary" 
                  : "group-hover:text-white"
              )}
            />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-success to-green-600 rounded-full flex items-center justify-center">
              <ApperIcon name="User" size={16} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">Admin User</p>
              <p className="text-xs text-gray-400">Administrator</p>
            </div>
          </div>
          <button className="p-2 text-gray-400 hover:text-white transition-colors">
            <ApperIcon name="LogOut" size={16} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <MobileSidebar />
      <DesktopSidebar />
    </>
  );
};

export default Sidebar;