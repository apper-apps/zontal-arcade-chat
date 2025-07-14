import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import GameCard from "@/components/molecules/GameCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { gameService } from "@/services/api/gameService";
import { blogService } from "@/services/api/blogService";

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  
  const [games, setGames] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState(query);
  const [activeTab, setActiveTab] = useState("games");
  const [sortBy, setSortBy] = useState("relevance");

  useEffect(() => {
    if (query) {
      performSearch(query);
    }
  }, [query]);

  const performSearch = async (searchQuery) => {
    try {
      setLoading(true);
      setError("");
      
      const [allGames, allPosts] = await Promise.all([
        gameService.getAll(),
        blogService.getAll(),
      ]);

      // Filter games
      const filteredGames = allGames.filter(game =>
        game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (game.tags && game.tags.some(tag => 
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        ))
      );

      // Filter blog posts
      const filteredPosts = allPosts.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (post.tags && post.tags.some(tag => 
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        ))
      );

      setGames(filteredGames);
      setBlogPosts(filteredPosts);
    } catch (err) {
      setError("Failed to perform search");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setSearchParams({ q: searchTerm.trim() });
    }
  };

  const sortedGames = [...games].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.publishedAt) - new Date(a.publishedAt);
      case "popular":
        return (b.plays || 0) - (a.plays || 0);
      case "rating":
        return (b.rating || 0) - (a.rating || 0);
      case "alphabetical":
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  const sortedPosts = [...blogPosts].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.publishedAt) - new Date(a.publishedAt);
      case "alphabetical":
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  if (loading) {
    return <Loading type="cards" count={8} />;
  }

  if (error) {
    return <Error message={error} onRetry={() => performSearch(query)} />;
  }

  const totalResults = games.length + blogPosts.length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Search Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold gradient-text mb-4">
          Search Results
        </h1>
        {query && (
          <p className="text-gray-400 mb-4">
            Found {totalResults} results for "{query}"
          </p>
        )}
        
        {/* Search Form */}
        <form onSubmit={handleSearch} className="flex gap-2 max-w-md">
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search games and articles..."
            className="flex-1"
          />
          <Button type="submit">
            <ApperIcon name="Search" size={16} />
          </Button>
        </form>
      </motion.div>

      {totalResults === 0 ? (
        <Empty 
          type="search"
          title="No results found"
          message={`No games or articles found for "${query}". Try different keywords or browse our categories.`}
        />
      ) : (
        <>
          {/* Tabs and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 p-4 bg-surface rounded-lg border border-gray-700"
          >
            <div className="flex space-x-1">
              <Button
                variant={activeTab === "games" ? "primary" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("games")}
              >
                <ApperIcon name="Gamepad2" size={16} className="mr-2" />
                Games ({games.length})
              </Button>
              <Button
                variant={activeTab === "blog" ? "primary" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("blog")}
              >
                <ApperIcon name="FileText" size={16} className="mr-2" />
                Articles ({blogPosts.length})
              </Button>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-400">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1 bg-gray-800 border border-gray-600 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="relevance">Relevance</option>
                <option value="newest">Newest</option>
                {activeTab === "games" && (
                  <>
                    <option value="popular">Most Popular</option>
                    <option value="rating">Highest Rated</option>
                  </>
                )}
                <option value="alphabetical">A-Z</option>
              </select>
            </div>
          </motion.div>

          {/* Results */}
          {activeTab === "games" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {sortedGames.length === 0 ? (
                <Empty 
                  type="games"
                  title="No games found"
                  message="Try searching for different keywords or browse our game categories."
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {sortedGames.map((game, index) => (
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
              )}
            </motion.div>
          )}

          {activeTab === "blog" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {sortedPosts.length === 0 ? (
                <Empty 
                  type="blog"
                  title="No articles found"
                  message="Try searching for different keywords or browse our blog categories."
                />
              ) : (
                <div className="space-y-6">
                  {sortedPosts.map((post, index) => (
                    <motion.article
                      key={post.Id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-surface rounded-lg p-6 border border-gray-700 hover:border-primary/50 transition-all duration-300"
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:space-x-6">
                        {post.featuredImage && (
                          <div className="w-full md:w-48 aspect-video md:aspect-square mb-4 md:mb-0">
                            <img
                              src={post.featuredImage}
                              alt={post.title}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          </div>
                        )}
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge variant="primary" size="sm">
                              {post.category}
                            </Badge>
                            <span className="text-sm text-gray-400">
                              {new Date(post.publishedAt).toLocaleDateString()}
                            </span>
                          </div>
                          
                          <h3 className="text-xl font-semibold text-white mb-2 hover:text-primary transition-colors">
                            {post.title}
                          </h3>
                          
                          <p className="text-gray-400 mb-4 line-clamp-2">
                            {post.excerpt}
                          </p>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.location.href = `/blog/${post.slug}`}
                          >
                            Read More
                            <ApperIcon name="ArrowRight" size={16} className="ml-2" />
                          </Button>
                        </div>
                      </div>
                    </motion.article>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </>
      )}
    </div>
  );
};

export default SearchResults;