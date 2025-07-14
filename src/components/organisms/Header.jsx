import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import ApperIcon from "@/components/ApperIcon";

const Header = ({ onMenuClick }) => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const navigate = useNavigate();

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // In a real app, this would toggle the theme
  };

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/blog", label: "Blog" },
  ];

  return (
    <header className="bg-surface/80 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 text-gray-400 hover:text-white transition-colors"
            >
              <ApperIcon name="Menu" size={24} />
            </button>

            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <ApperIcon name="Gamepad2" size={20} className="text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold gradient-text">Zontal Arcade</h1>
              </div>
            </Link>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="text-gray-300 hover:text-white transition-colors font-medium"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-8 hidden sm:block">
            <SearchBar />
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Dark Mode Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleDarkMode}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <ApperIcon name={isDarkMode ? "Sun" : "Moon"} size={20} />
            </motion.button>

            {/* Admin Panel Link */}
            <Button
              onClick={() => navigate("/admin")}
              variant="ghost"
              size="sm"
              className="hidden sm:flex"
            >
              <ApperIcon name="Settings" size={16} className="mr-2" />
              Admin
            </Button>

            {/* Mobile Search */}
            <button className="sm:hidden p-2 text-gray-400 hover:text-white transition-colors">
              <ApperIcon name="Search" size={20} />
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="sm:hidden pb-4">
          <SearchBar />
        </div>
      </div>
    </header>
  );
};

export default Header;