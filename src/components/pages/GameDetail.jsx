import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import GameCard from "@/components/molecules/GameCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { gameService } from "@/services/api/gameService";
import { commentService } from "@/services/api/commentService";

const GameDetail = () => {
  const { slug } = useParams();
  const [game, setGame] = useState(null);
  const [relatedGames, setRelatedGames] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const [commentForm, setCommentForm] = useState({
    author: "",
    email: "",
    content: "",
  });

  useEffect(() => {
    loadGameData();
  }, [slug]);

  const loadGameData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const games = await gameService.getAll();
      const gameData = games.find(g => g.slug === slug);
      
      if (!gameData) {
        setError("Game not found");
        return;
      }

      setGame(gameData);
      setLikeCount(gameData.likes || 0);
      
      // Load related games (same category)
      const related = games
        .filter(g => g.category === gameData.category && g.Id !== gameData.Id)
        .slice(0, 4);
      setRelatedGames(related);

      // Load comments
      const gameComments = await commentService.getByGameId(gameData.Id);
      setComments(gameComments);
    } catch (err) {
      setError("Failed to load game data");
    } finally {
      setLoading(false);
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
    toast.success(isLiked ? "Removed from favorites" : "Added to favorites");
  };

  const handleShare = async (platform) => {
    const url = window.location.href;
    const title = `Play ${game.title} - Zontal Arcade`;
    
    let shareUrl = "";
    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        break;
      case "copy":
        try {
          await navigator.clipboard.writeText(url);
          toast.success("Link copied to clipboard!");
        } catch (err) {
          toast.error("Failed to copy link");
        }
        return;
    }
    
    if (shareUrl) {
      window.open(shareUrl, "_blank", "width=550,height=420");
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      const newComment = await commentService.create({
        gameId: game.Id,
        ...commentForm,
        status: "approved",
      });
      setComments([...comments, newComment]);
      setCommentForm({ author: "", email: "", content: "" });
      toast.success("Comment added successfully!");
    } catch (err) {
      toast.error("Failed to add comment");
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (loading) {
    return <Loading type="cards" count={1} />;
  }

  if (error) {
    return <Error message={error} onRetry={loadGameData} type="notFound" />;
  }

  if (!game) {
    return <Error message="Game not found" type="notFound" />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-gray-400">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ApperIcon name="ChevronRight" size={16} />
            <Link to={`/category/${game.category.toLowerCase()}`} className="hover:text-white transition-colors">
              {game.category}
            </Link>
            <ApperIcon name="ChevronRight" size={16} />
            <span className="text-white">{game.title}</span>
          </nav>

          {/* Game Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-surface rounded-lg p-6 border border-gray-700"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold gradient-text mb-2">{game.title}</h1>
                <div className="flex items-center space-x-4">
                  <Badge variant="primary">{game.category}</Badge>
                  <div className="flex items-center space-x-1 text-yellow-400">
                    <ApperIcon name="Star" size={16} className="fill-current" />
                    <span className="font-medium">{game.rating}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-gray-400">
                    <ApperIcon name="Play" size={16} />
                    <span>{game.plays || 0} plays</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                <Button
                  variant="secondary"
                  onClick={handleLike}
                  className={isLiked ? "text-accent" : ""}
                >
                  <ApperIcon name="Heart" size={16} className={`mr-2 ${isLiked ? "fill-current" : ""}`} />
                  {likeCount}
                </Button>
                <Button variant="secondary" onClick={() => handleShare("copy")}>
                  <ApperIcon name="Share" size={16} className="mr-2" />
                  Share
                </Button>
              </div>
            </div>
            
            <p className="text-gray-300 leading-relaxed">{game.description}</p>

            {/* Tags */}
            {game.tags && game.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {game.tags.map((tag, index) => (
                  <Badge key={index} variant="default" size="sm">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </motion.div>

          {/* Game Player */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-surface rounded-lg border border-gray-700 overflow-hidden"
          >
            <div className="flex items-center justify-between p-4 bg-gray-800">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-error rounded-full"></div>
                <div className="w-3 h-3 bg-warning rounded-full"></div>
                <div className="w-3 h-3 bg-success rounded-full"></div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" onClick={toggleFullscreen}>
                  <ApperIcon name={isFullscreen ? "Minimize" : "Maximize"} size={16} />
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <div className={`aspect-video ${isFullscreen ? "fixed inset-0 z-50 bg-black" : ""}`}>
                <iframe
                  src={game.gameUrl}
                  title={game.title}
                  className="w-full h-full"
                  allowFullScreen
                />
              </div>
              
              <div className="absolute top-4 left-4 right-4 flex justify-between items-center opacity-0 hover:opacity-100 transition-opacity">
                <div className="bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1">
                  <span className="text-white text-sm font-medium">{game.title}</span>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" onClick={() => handleShare("facebook")}>
                    <ApperIcon name="Facebook" size={16} />
                  </Button>
                  <Button size="sm" onClick={() => handleShare("twitter")}>
                    <ApperIcon name="Twitter" size={16} />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Comments Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-surface rounded-lg p-6 border border-gray-700"
          >
            <h2 className="text-xl font-semibold text-white mb-6">
              Comments ({comments.length})
            </h2>

            {/* Comment Form */}
            <form onSubmit={handleCommentSubmit} className="space-y-4 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={commentForm.author}
                    onChange={(e) => setCommentForm({ ...commentForm, author: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={commentForm.email}
                    onChange={(e) => setCommentForm({ ...commentForm, email: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Comment *
                </label>
                <textarea
                  value={commentForm.content}
                  onChange={(e) => setCommentForm({ ...commentForm, content: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  placeholder="Share your thoughts about this game..."
                  required
                />
              </div>
              <Button type="submit">
                <ApperIcon name="MessageCircle" size={16} className="mr-2" />
                Post Comment
              </Button>
            </form>

            {/* Comments List */}
            {comments.length === 0 ? (
              <Empty type="comments" />
            ) : (
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.Id} className="bg-gray-800/50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            {comment.author.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-medium text-white">{comment.author}</h4>
                          <p className="text-sm text-gray-400">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-300">{comment.content}</p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Related Games */}
          {relatedGames.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-surface rounded-lg p-6 border border-gray-700"
            >
              <h3 className="text-xl font-semibold text-white mb-4">Related Games</h3>
              <div className="space-y-4">
                {relatedGames.map((relatedGame) => (
                  <Link
                    key={relatedGame.Id}
                    to={`/game/${relatedGame.slug}`}
                    className="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    <img
                      src={relatedGame.thumbnail}
                      alt={relatedGame.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-white">{relatedGame.title}</h4>
                      <p className="text-sm text-gray-400">{relatedGame.category}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <div className="flex items-center space-x-1 text-yellow-400">
                          <ApperIcon name="Star" size={12} className="fill-current" />
                          <span className="text-xs">{relatedGame.rating}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-gray-400">
                          <ApperIcon name="Play" size={12} />
                          <span className="text-xs">{relatedGame.plays || 0}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}

          {/* Ad Space */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-surface rounded-lg p-6 border border-gray-700"
          >
            <div className="text-center text-gray-400">
              <ApperIcon name="DollarSign" size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-sm">Advertisement Space</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default GameDetail;