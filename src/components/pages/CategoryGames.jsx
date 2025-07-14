import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import GameCard from "@/components/molecules/GameCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { gameService } from "@/services/api/gameService";
import { categoryService } from "@/services/api/categoryService";

const CategoryGames = () => {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [games, setGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const gamesPerPage = 12;

  useEffect(() => {
    loadCategoryData();
  }, [slug]);

  useEffect(() => {
    filterAndSortGames();
  }, [games, searchTerm, sortBy]);

  const loadCategoryData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [allGames, categories] = await Promise.all([
        gameService.getAll(),
        categoryService.getAll(),
      ]);

      const categoryData = categories.find(c => c.slug === slug);
      if (!categoryData) {
        setError("Category not found");
        return;
      }

      setCategory(categoryData);
      const categoryGames = allGames.filter(game => 
        game.category.toLowerCase() === categoryData.name.toLowerCase()
      );
      setGames(categoryGames);
    } catch (err) {
      setError("Failed to load category games");
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortGames = () => {
    let filtered = games;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(game =>
        game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        game.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort games
    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
        break;
      case "oldest":
        filtered.sort((a, b) => new Date(a.publishedAt) - new Date(b.publishedAt));
        break;
      case "popular":
        filtered.sort((a, b) => (b.plays || 0) - (a.plays || 0));
        break;
      case "rating":
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "alphabetical":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }

    setFilteredGames(filtered);
    setCurrentPage(1);
  };

  const getPaginatedGames = () => {
    const startIndex = (currentPage - 1) * gamesPerPage;
    const endIndex = startIndex + gamesPerPage;
    return filteredGames.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(filteredGames.length / gamesPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return <Loading type="cards" count={12} />;
  }

  if (error) {
    return <Error message={error} onRetry={loadCategoryData} type="notFound" />;
  }

  if (!category) {
    return <Error message="Category not found" type="notFound" />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Category Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="flex items-center justify-center mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
            <ApperIcon name={category.icon} size={32} className="text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold gradient-text mb-2">{category.name} Games</h1>
        <p className="text-xl text-gray-400">
          {filteredGames.length} {filteredGames.length === 1 ? "game" : "games"} available
        </p>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col md:flex-row gap-4 mb-8 p-4 bg-surface rounded-lg border border-gray-700"
      >
        <div className="flex-1">
          <Input
            placeholder="Search games..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="popular">Most Popular</option>
            <option value="rating">Highest Rated</option>
            <option value="alphabetical">A-Z</option>
          </select>
        </div>
      </motion.div>

      {/* Games Grid */}
      {filteredGames.length === 0 ? (
        <Empty 
          type="search"
          title="No games found"
          message={searchTerm ? "Try adjusting your search terms." : "No games available in this category yet."}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {getPaginatedGames().map((game, index) => (
              <motion.div
                key={game.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <GameCard game={game} />
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex justify-center items-center space-x-2"
            >
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ApperIcon name="ChevronLeft" size={16} />
              </Button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "primary" : "secondary"}
                  size="sm"
                  onClick={() => handlePageChange(page)}
                  className={currentPage === page ? "bg-primary text-white" : ""}
                >
                  {page}
                </Button>
              ))}
              
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <ApperIcon name="ChevronRight" size={16} />
              </Button>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
};

export default CategoryGames;