import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import StatsCard from "@/components/molecules/StatsCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { gameService } from "@/services/api/gameService";

const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [recentGames, setRecentGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const games = await gameService.getAll();
      const totalGames = games.length;
      const totalPlays = games.reduce((sum, game) => sum + (game.plays || 0), 0);
      const totalLikes = games.reduce((sum, game) => sum + (game.likes || 0), 0);
      const featuredGames = games.filter(game => game.featured).length;
      
      setStats({
        totalGames,
        totalPlays,
        totalLikes,
        featuredGames,
        revenue: 2450.75, // Mock revenue data
      });
      
      setRecentGames(games.slice(0, 5));
    } catch (err) {
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading type="dashboard" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadDashboardData} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text mb-2">Dashboard</h1>
          <p className="text-gray-400">Welcome back! Here's your gaming portal overview.</p>
        </div>
        <div className="flex space-x-3 mt-4 sm:mt-0">
          <Button variant="ghost" size="sm">
            <ApperIcon name="Download" size={16} className="mr-2" />
            Export Data
          </Button>
          <Button size="sm">
            <ApperIcon name="Plus" size={16} className="mr-2" />
            Add Game
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Games"
          value={stats.totalGames}
          change="+12%"
          changeType="positive"
          icon="Gamepad2"
        />
        <StatsCard
          title="Total Plays"
          value={stats.totalPlays?.toLocaleString()}
          change="+8%"
          changeType="positive"
          icon="Play"
        />
        <StatsCard
          title="Total Likes"
          value={stats.totalLikes?.toLocaleString()}
          change="+15%"
          changeType="positive"
          icon="Heart"
        />
        <StatsCard
          title="Revenue"
          value={`$${stats.revenue?.toFixed(2)}`}
          change="+23%"
          changeType="positive"
          icon="DollarSign"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Games */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 rounded-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Recent Games</h2>
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </div>
          <div className="space-y-4">
            {recentGames.map((game) => (
              <div key={game.Id} className="flex items-center space-x-4 p-3 bg-surface/50 rounded-lg">
                <img
                  src={game.thumbnail}
                  alt={game.title}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-medium text-white">{game.title}</h3>
                  <p className="text-sm text-gray-400">{game.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-white">{game.plays || 0} plays</p>
                  <p className="text-xs text-gray-400">{game.likes || 0} likes</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6 rounded-lg"
        >
          <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <Button variant="secondary" className="h-20 flex-col">
              <ApperIcon name="Plus" size={20} className="mb-2" />
              Add Game
            </Button>
            <Button variant="secondary" className="h-20 flex-col">
              <ApperIcon name="Grid3x3" size={20} className="mb-2" />
              Manage Categories
            </Button>
            <Button variant="secondary" className="h-20 flex-col">
              <ApperIcon name="FileText" size={20} className="mb-2" />
              Write Post
            </Button>
            <Button variant="secondary" className="h-20 flex-col">
              <ApperIcon name="DollarSign" size={20} className="mb-2" />
              Manage Ads
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Performance Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-6 rounded-lg"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Performance Overview</h2>
          <div className="flex space-x-2">
            <Button variant="ghost" size="sm">7 Days</Button>
            <Button variant="ghost" size="sm">30 Days</Button>
            <Button variant="ghost" size="sm">90 Days</Button>
          </div>
        </div>
        <div className="h-64 bg-surface/30 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <ApperIcon name="BarChart3" size={48} className="text-gray-600 mx-auto mb-2" />
            <p className="text-gray-400">Chart visualization would go here</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;