import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import FormField from "@/components/molecules/FormField";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { gameService } from "@/services/api/gameService";
import { categoryService } from "@/services/api/categoryService";

const GameManager = () => {
  const [games, setGames] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isAddingGame, setIsAddingGame] = useState(false);
  const [editingGame, setEditingGame] = useState(null);

  const [gameForm, setGameForm] = useState({
    title: "",
    description: "",
    thumbnail: "",
    gameUrl: "",
    category: "",
    tags: "",
    featured: false,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [gamesData, categoriesData] = await Promise.all([
        gameService.getAll(),
        categoryService.getAll(),
      ]);
      setGames(gamesData);
      setCategories(categoriesData);
    } catch (err) {
      setError("Failed to load games");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const gameData = {
        ...gameForm,
        tags: gameForm.tags.split(",").map(tag => tag.trim()),
        slug: gameForm.title.toLowerCase().replace(/\s+/g, "-"),
        likes: 0,
        plays: 0,
        rating: 4.5,
        publishedAt: new Date().toISOString(),
      };

      if (editingGame) {
        await gameService.update(editingGame.Id, gameData);
        setGames(games.map(game => 
          game.Id === editingGame.Id ? { ...game, ...gameData } : game
        ));
        toast.success("Game updated successfully!");
        setEditingGame(null);
      } else {
        const newGame = await gameService.create(gameData);
        setGames([...games, newGame]);
        toast.success("Game added successfully!");
      }

      setGameForm({
        title: "",
        description: "",
        thumbnail: "",
        gameUrl: "",
        category: "",
        tags: "",
        featured: false,
      });
      setIsAddingGame(false);
    } catch (err) {
      toast.error("Failed to save game");
    }
  };

  const handleEdit = (game) => {
    setEditingGame(game);
    setGameForm({
      title: game.title,
      description: game.description,
      thumbnail: game.thumbnail,
      gameUrl: game.gameUrl,
      category: game.category,
      tags: Array.isArray(game.tags) ? game.tags.join(", ") : game.tags || "",
      featured: game.featured || false,
    });
    setIsAddingGame(true);
  };

  const handleDelete = async (gameId) => {
    if (window.confirm("Are you sure you want to delete this game?")) {
      try {
        await gameService.delete(gameId);
        setGames(games.filter(game => game.Id !== gameId));
        toast.success("Game deleted successfully!");
      } catch (err) {
        toast.error("Failed to delete game");
      }
    }
  };

  const filteredGames = games.filter(game => {
    const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         game.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || game.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return <Loading type="table" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadData} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text mb-2">Game Manager</h1>
          <p className="text-gray-400">Manage your HTML5 games collection</p>
        </div>
        <Button onClick={() => setIsAddingGame(true)}>
          <ApperIcon name="Plus" size={16} className="mr-2" />
          Add New Game
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 p-4 bg-surface rounded-lg border border-gray-700">
        <div className="flex-1">
          <Input
            placeholder="Search games..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="w-full sm:w-48">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full h-10 px-3 py-2 bg-surface border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category.Id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Games Table */}
      {filteredGames.length === 0 ? (
        <Empty 
          type="games"
          action={() => setIsAddingGame(true)}
          actionLabel="Add First Game"
        />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface rounded-lg border border-gray-700 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800">
                <tr>
                  <th className="text-left p-4 text-gray-300 font-medium">Game</th>
                  <th className="text-left p-4 text-gray-300 font-medium">Category</th>
                  <th className="text-left p-4 text-gray-300 font-medium">Stats</th>
                  <th className="text-left p-4 text-gray-300 font-medium">Status</th>
                  <th className="text-left p-4 text-gray-300 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredGames.map((game) => (
                  <tr key={game.Id} className="border-t border-gray-700 hover:bg-gray-800/50">
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={game.thumbnail}
                          alt={game.title}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <h3 className="font-medium text-white">{game.title}</h3>
                          <p className="text-sm text-gray-400 truncate max-w-xs">
                            {game.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant="default" size="sm">
                        {game.category}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-gray-400">
                        <div className="flex items-center space-x-2">
                          <ApperIcon name="Play" size={14} />
                          <span>{game.plays || 0}</span>
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          <ApperIcon name="Heart" size={14} />
                          <span>{game.likes || 0}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      {game.featured ? (
                        <Badge variant="primary" size="sm">
                          <ApperIcon name="Star" size={12} className="mr-1" />
                          Featured
                        </Badge>
                      ) : (
                        <Badge variant="default" size="sm">
                          Published
                        </Badge>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(game)}
                        >
                          <ApperIcon name="Edit" size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(game.Id)}
                          className="text-error hover:text-error hover:bg-error/20"
                        >
                          <ApperIcon name="Trash" size={14} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Add/Edit Game Modal */}
      {isAddingGame && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-surface rounded-lg border border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">
                  {editingGame ? "Edit Game" : "Add New Game"}
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsAddingGame(false);
                    setEditingGame(null);
                    setGameForm({
                      title: "",
                      description: "",
                      thumbnail: "",
                      gameUrl: "",
                      category: "",
                      tags: "",
                      featured: false,
                    });
                  }}
                >
                  <ApperIcon name="X" size={16} />
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    label="Game Title"
                    required
                    value={gameForm.title}
                    onChange={(e) => setGameForm({ ...gameForm, title: e.target.value })}
                  />
                  <FormField
                    label="Category"
                    required
                  >
                    <select
                      value={gameForm.category}
                      onChange={(e) => setGameForm({ ...gameForm, category: e.target.value })}
                      className="w-full h-10 px-3 py-2 bg-surface border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map(category => (
                        <option key={category.Id} value={category.name}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </FormField>
                </div>

                <FormField
                  label="Description"
                  required
                >
                  <textarea
                    value={gameForm.description}
                    onChange={(e) => setGameForm({ ...gameForm, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 bg-surface border border-gray-600 rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    required
                  />
                </FormField>

                <FormField
                  label="Thumbnail URL"
                  required
                  value={gameForm.thumbnail}
                  onChange={(e) => setGameForm({ ...gameForm, thumbnail: e.target.value })}
                />

                <FormField
                  label="Game URL"
                  required
                  value={gameForm.gameUrl}
                  onChange={(e) => setGameForm({ ...gameForm, gameUrl: e.target.value })}
                />

                <FormField
                  label="Tags (comma-separated)"
                  value={gameForm.tags}
                  onChange={(e) => setGameForm({ ...gameForm, tags: e.target.value })}
                />

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={gameForm.featured}
                    onChange={(e) => setGameForm({ ...gameForm, featured: e.target.checked })}
                    className="w-4 h-4 text-primary bg-surface border-gray-600 rounded focus:ring-primary"
                  />
                  <label htmlFor="featured" className="text-sm text-gray-300">
                    Featured Game
                  </label>
                </div>

                <div className="flex space-x-3 pt-4">
                  <Button type="submit" className="flex-1">
                    {editingGame ? "Update Game" : "Add Game"}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setIsAddingGame(false);
                      setEditingGame(null);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default GameManager;