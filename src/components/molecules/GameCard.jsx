import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState } from "react";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const GameCard = ({ game, className, variant = "default" }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(game.likes || 0);

  const handleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handlePlay = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Navigate to game page
    window.location.href = `/game/${game.slug}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className={cn("group", className)}
    >
      <Link to={`/game/${game.slug}`}>
        <div className="game-card bg-surface rounded-lg overflow-hidden border border-gray-700 hover:border-primary/50 transition-all duration-300">
          {/* Game Thumbnail */}
          <div className="relative aspect-[4/3] overflow-hidden">
            <img
              src={game.thumbnail}
              alt={game.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileHover={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <Button
                  onClick={handlePlay}
                  size="lg"
                  className="play-button bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 rounded-full w-16 h-16 p-0 opacity-0 group-hover:opacity-100 transition-all duration-300"
                >
                  <ApperIcon name="Play" size={24} className="ml-1" />
                </Button>
              </motion.div>
            </div>

            {/* Featured Badge */}
            {game.featured && (
              <div className="absolute top-2 left-2">
                <Badge variant="primary" size="sm">
                  <ApperIcon name="Star" size={12} className="mr-1" />
                  Featured
                </Badge>
              </div>
            )}

            {/* Like Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleLike}
              className={cn(
                "absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200",
                isLiked 
                  ? "bg-accent text-white" 
                  : "bg-black/50 text-white hover:bg-accent/80"
              )}
            >
              <ApperIcon name="Heart" size={16} className={isLiked ? "fill-current" : ""} />
            </motion.button>
          </div>

          {/* Game Info */}
          <div className="p-4">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-white truncate mr-2 group-hover:text-primary transition-colors">
                {game.title}
              </h3>
              <div className="flex items-center space-x-1 text-yellow-400">
                <ApperIcon name="Star" size={14} className="fill-current" />
                <span className="text-sm font-medium">{game.rating}</span>
              </div>
            </div>

            <p className="text-sm text-gray-400 mb-3 line-clamp-2">
              {game.description}
            </p>

            <div className="flex items-center justify-between">
              <Badge variant="default" size="sm">
                {game.category}
              </Badge>
              
              <div className="flex items-center space-x-3 text-sm text-gray-400">
                <div className="flex items-center space-x-1">
                  <ApperIcon name="Heart" size={14} />
                  <span>{likeCount}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <ApperIcon name="Play" size={14} />
                  <span>{game.plays || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default GameCard;