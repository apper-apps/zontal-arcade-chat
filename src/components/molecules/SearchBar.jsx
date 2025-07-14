import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const SearchBar = ({ 
  className, 
  placeholder = "Search games...", 
  enableSuggestions = true 
}) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Mock suggestions data
  const mockSuggestions = [
    { id: 1, title: "Pac-Man Adventure", type: "game", category: "Arcade" },
    { id: 2, title: "Space Invaders", type: "game", category: "Arcade" },
    { id: 3, title: "Puzzle Quest", type: "game", category: "Puzzle" },
    { id: 4, title: "Racing Thunder", type: "game", category: "Racing" },
    { id: 5, title: "Action Games", type: "category", count: 45 },
    { id: 6, title: "Puzzle Games", type: "category", count: 32 },
  ];

  useEffect(() => {
    if (query.length > 1) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        const filtered = mockSuggestions.filter(item => 
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          (item.category && item.category.toLowerCase().includes(query.toLowerCase()))
        );
        setSuggestions(filtered);
        setShowSuggestions(true);
        setIsLoading(false);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [query]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setShowSuggestions(false);
      inputRef.current?.blur();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    if (suggestion.type === "game") {
      navigate(`/game/${suggestion.title.toLowerCase().replace(/\s+/g, "-")}`);
    } else if (suggestion.type === "category") {
      navigate(`/category/${suggestion.title.toLowerCase().replace(/\s+/g, "-")}`);
    }
    setQuery("");
    setShowSuggestions(false);
  };

  return (
    <div className={cn("relative", className)}>
      <form onSubmit={handleSearch} className="relative">
        <Input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="pr-10 bg-surface/80 backdrop-blur-sm border-gray-600 focus:border-primary"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-white transition-colors"
        >
          <ApperIcon name="Search" size={16} />
        </button>
      </form>

      <AnimatePresence>
        {showSuggestions && (suggestions.length > 0 || isLoading) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 z-50 mt-2 bg-surface border border-gray-600 rounded-lg shadow-xl overflow-hidden"
          >
            {isLoading ? (
              <div className="p-4 text-center text-gray-400">
                <ApperIcon name="Loader2" size={16} className="animate-spin mx-auto mb-2" />
                Searching...
              </div>
            ) : (
              suggestions.map((suggestion) => (
                <motion.button
                  key={suggestion.id}
                  whileHover={{ backgroundColor: "rgba(75, 85, 99, 0.5)" }}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full p-3 text-left hover:bg-gray-700 flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <ApperIcon 
                      name={suggestion.type === "game" ? "Gamepad2" : "Grid3x3"} 
                      size={16} 
                      className="text-gray-400" 
                    />
                    <div>
                      <div className="text-white font-medium">{suggestion.title}</div>
                      {suggestion.category && (
                        <div className="text-xs text-gray-400">{suggestion.category}</div>
                      )}
                      {suggestion.count && (
                        <div className="text-xs text-gray-400">{suggestion.count} games</div>
                      )}
                    </div>
                  </div>
                  <ApperIcon name="ArrowRight" size={14} className="text-gray-400" />
                </motion.button>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;