import React, { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Heart, Play, Share2, Star } from "lucide-react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import { gameService } from "@/services/api/gameService";
import { commentService } from "@/services/api/commentService";

export function GameDetail() {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [rating, setRating] = useState(0);
  const [gameLoadError, setGameLoadError] = useState(false);
  const [gameReady, setGameReady] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentForm, setCommentForm] = useState({ author: "", email: "", content: "" });
  const [relatedGames, setRelatedGames] = useState([]);
  const gameContainerRef = useRef(null);
  const iframeRef = useRef(null);

  useEffect(() => {
    const fetchGame = async () => {
      try {
        setLoading(true);
        setError(null);
        const gameData = await gameService.getGameById(id);
        setGame(gameData);
        setIsFavorite(gameData.isFavorite || false);
        setIsLiked(gameData.isLiked || false);
        setLikeCount(gameData.likeCount || 0);
        setRating(gameData.rating || 0);
        
        // Load related games and comments
        const [relatedData, commentsData] = await Promise.all([
          gameService.getRelatedGames(gameData.category, gameData.Id),
          commentService.getByGameId(gameData.Id)
        ]);
        
        setRelatedGames(relatedData || []);
        setComments(commentsData || []);
      } catch (err) {
        console.error('Error loading game:', err);
        setError(err.message || 'Failed to load game');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchGame();
    }
  }, [id]);

  // Canvas error monitoring
  useEffect(() => {
    const handleCanvasError = (event) => {
      if (event.target.tagName === 'CANVAS' || event.message?.includes('canvas')) {
        console.error('Canvas error in game:', event);
        setGameLoadError(true);
        toast.error('Game loading error - please try again');
      }
    };

    const handleGameLoad = () => {
      setGameReady(true);
      setGameLoadError(false);
    };

    window.addEventListener('error', handleCanvasError);
    
    return () => {
      window.removeEventListener('error', handleCanvasError);
    };
  }, []);

  const handlePlay = () => {
    try {
      // Ensure container has proper dimensions
      if (gameContainerRef.current) {
        const rect = gameContainerRef.current.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) {
          toast.error('Game container not ready - please try again');
          return;
        }
      }

      setIsPlaying(true);
      setGameLoadError(false);
      toast.success('Game started!');
    } catch (error) {
      console.error('Error starting game:', error);
      setGameLoadError(true);
      toast.error('Failed to start game');
    }
  };

const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? 'Removed from favorites' : 'Added to favorites');
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
    toast.success(isLiked ? "Removed from favorites" : "Added to favorites");
  };

const handleRate = (stars) => {
    setRating(stars);
    toast.success(`Rated ${stars} stars`);
  };

  const handleShare = async (platform) => {
    const url = window.location.href;
    const title = `Play ${game?.title || 'Game'} - Zontal Arcade`;
    
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
        gameId: game?.Id,
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

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;
  if (!game) return <Error message="Game not found" />;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Game Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-surface rounded-lg p-6 border border-gray-700"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center space-x-4">
                <img
                  src={game.thumbnail || '/placeholder-game.jpg'}
                  alt={game.title}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div>
                  <h1 className="text-2xl font-bold text-white">{game.title}</h1>
                  <div className="flex items-center space-x-4 mt-1">
                    <div className="flex items-center space-x-1 text-yellow-400">
                      <ApperIcon name="Star" size={16} className="fill-current" />
                      <span className="font-medium">{game.rating || 0}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-400">
                      <ApperIcon name="Play" size={16} />
                      <span>{game.plays || 0} plays</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="primary"
                  onClick={handlePlay}
                  disabled={isPlaying}
                  className="flex items-center space-x-2"
                >
                  <Play size={16} />
                  <span>{isPlaying ? 'Playing' : 'Play Game'}</span>
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleLike}
                  className={isLiked ? "text-accent" : ""}
                >
                  <Heart size={16} className={`mr-2 ${isLiked ? "fill-current" : ""}`} />
                  {likeCount}
                </Button>
                <Button variant="secondary" onClick={() => handleShare("copy")}>
                  <Share2 size={16} className="mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Game Player */}
{isPlaying && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
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
                  <div 
                    ref={gameContainerRef}
                    className="w-full h-full"
                  >
                    {gameLoadError ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <p className="text-lg font-semibold mb-2">Game Loading Error</p>
                          <p className="text-sm mb-4">Canvas rendering failed - please try again</p>
                          <Button 
                            onClick={() => {
                              setGameLoadError(false);
                              setIsPlaying(false);
                            }}
                            variant="primary"
                          >
                            Retry Game
                          </Button>
                        </div>
                      </div>
                    ) : !gameReady ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                          <p className="text-gray-400">Loading game...</p>
                        </div>
                      </div>
                    ) : (
                      <iframe
                        ref={iframeRef}
                        src={game.gameUrl || '/game-placeholder.html'}
                        title={game.title}
                        className="w-full h-full"
                        onLoad={() => setGameReady(true)}
                        onError={() => setGameLoadError(true)}
                        allow="fullscreen; autoplay; encrypted-media"
                        sandbox="allow-scripts allow-same-origin allow-forms"
                        allowFullScreen
                      />
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Game Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-surface rounded-lg p-6 border border-gray-700"
          >
            <h3 className="text-xl font-bold mb-4">About This Game</h3>
            <p className="text-gray-300 leading-relaxed mb-6">
              {game.description}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Game Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Category:</span>
                    <span>{game.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Players:</span>
                    <span>{game.players || 'Single Player'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Rating:</span>
                    <span className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={`${i < (game.rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`}
                        />
                      ))}
                      <span className="ml-1">{game.rating || 0}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

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
                            {comment.author?.charAt(0).toUpperCase() || 'A'}
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