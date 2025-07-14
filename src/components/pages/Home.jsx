import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import GameCard from "@/components/molecules/GameCard";
import CategoryCard from "@/components/molecules/CategoryCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { gameService } from "@/services/api/gameService";
import { categoryService } from "@/services/api/categoryService";
import { blogService } from "@/services/api/blogService";

const Home = () => {
  const [featuredGames, setFeaturedGames] = useState([]);
  const [categories, setCategories] = useState([]);
  const [recentGames, setRecentGames] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [games, categoriesData, posts] = await Promise.all([
        gameService.getAll(),
        categoryService.getAll(),
        blogService.getAll(),
      ]);

      setFeaturedGames(games.filter(game => game.featured).slice(0, 8));
      setRecentGames(games.slice(0, 12));
      setCategories(categoriesData.slice(0, 6));
      setBlogPosts(posts.slice(0, 3));
    } catch (err) {
      setError("Failed to load homepage data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading type="cards" count={12} />;
  }

  if (error) {
    return <Error message={error} onRetry={loadHomeData} />;
  }

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
className="relative overflow-hidden bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 rounded-2xl"
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.03%22%3E%3Cpath%20d%3D%22M36%2030a6%206%200%201%201-12%200%206%206%200%200%201%2012%200zm-30%200a6%206%200%201%201-12%200%206%206%200%200%201%2012%200zm60%200a6%206%200%201%201-12%200%206%206%200%200%201%2012%200z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-bold gradient-text mb-6"
            >
              The Ultimate Gaming Portal
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-300 max-w-3xl mx-auto mb-8"
            >
              Discover and play over 1200+ HTML5 games across all genres. 
              From action-packed adventures to mind-bending puzzles, we have something for every gamer.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row justify-center gap-4"
            >
              <Button size="lg" className="text-lg px-8 py-4">
                <ApperIcon name="Play" size={20} className="mr-2" />
                Start Playing
              </Button>
              <Button variant="secondary" size="lg" className="text-lg px-8 py-4">
                <ApperIcon name="Grid3x3" size={20} className="mr-2" />
                Browse Categories
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Featured Games */}
      {featuredGames.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-8"
          >
            <div>
              <h2 className="text-3xl font-bold gradient-text mb-2">Featured Games</h2>
              <p className="text-gray-400">Hand-picked games that you'll love</p>
            </div>
            <Link to="/category/featured">
              <Button variant="ghost">
                View All <ApperIcon name="ArrowRight" size={16} className="ml-2" />
              </Button>
            </Link>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredGames.map((game, index) => (
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
        </section>
      )}

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold gradient-text mb-4">Game Categories</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Explore games by genre and find your next favorite adventure
          </p>
        </motion.div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category, index) => (
            <motion.div
              key={category.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <CategoryCard category={category} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Recent Games */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h2 className="text-3xl font-bold gradient-text mb-2">Latest Games</h2>
            <p className="text-gray-400">Newest additions to our game collection</p>
          </div>
          <Link to="/category/recent">
            <Button variant="ghost">
              View All <ApperIcon name="ArrowRight" size={16} className="ml-2" />
            </Button>
          </Link>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {recentGames.map((game, index) => (
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
      </section>

      {/* Blog Section */}
      {blogPosts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-8"
          >
            <div>
              <h2 className="text-3xl font-bold gradient-text mb-2">Latest News</h2>
              <p className="text-gray-400">Gaming news, reviews, and updates</p>
            </div>
            <Link to="/blog">
              <Button variant="ghost">
                View All <ApperIcon name="ArrowRight" size={16} className="ml-2" />
              </Button>
            </Link>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.map((post, index) => (
              <motion.div
                key={post.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={`/blog/${post.slug}`}>
                  <div className="bg-surface rounded-lg overflow-hidden border border-gray-700 hover:border-primary/50 transition-all duration-300 group">
                    {post.featuredImage && (
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={post.featuredImage}
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-center space-x-2 mb-3">
                        <span className="text-sm text-primary font-medium">{post.category}</span>
                        <span className="text-sm text-gray-500">•</span>
                        <span className="text-sm text-gray-400">
                          {new Date(post.publishedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-gray-400 line-clamp-3">{post.excerpt}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-4">
            Ready to Start Gaming?
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
            Join thousands of players enjoying our massive collection of HTML5 games. 
            No downloads, no installations - just pure gaming fun!
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="text-lg px-8 py-4">
              <ApperIcon name="Gamepad2" size={20} className="mr-2" />
              Play Now
            </Button>
            <Button variant="secondary" size="lg" className="text-lg px-8 py-4">
              <ApperIcon name="BookOpen" size={20} className="mr-2" />
              Learn More
            </Button>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default Home;