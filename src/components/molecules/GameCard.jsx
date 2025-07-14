import React, { useEffect, useRef, useState } from "react";
import { Heart, Play, Star } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";

export function GameCard({ game, onPlay, onFavorite, isFavorite }) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [gameError, setGameError] = useState(false);
  const [likeCount, setLikeCount] = useState(game?.likes || 0);
  const [isLiked, setIsLiked] = useState(isFavorite || false);
  const cardRef = useRef(null);
  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setIsLoading(false);
  };

const handlePlay = () => {
    try {
      // Reset error state
      setGameError(false);
      
      // Enhanced dimension validation
      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();
        const computedStyle = window.getComputedStyle(cardRef.current);
        
        // Check multiple dimension sources
        const hasValidDimensions = (
          rect.width > 0 && 
          rect.height > 0 && 
          parseInt(computedStyle.width) > 0 && 
          parseInt(computedStyle.height) > 0
        );
        
        if (!hasValidDimensions) {
          console.warn('Card dimensions invalid:', { 
            rect: { width: rect.width, height: rect.height },
            computed: { width: computedStyle.width, height: computedStyle.height }
          });
          setGameError(true);
          return;
        }
        
        // Check for any existing canvas elements
        const canvasElements = cardRef.current.querySelectorAll('canvas');
        for (const canvas of canvasElements) {
          if (canvas.width === 0 || canvas.height === 0) {
            console.warn('Canvas with zero dimensions found:', canvas);
            setGameError(true);
            return;
          }
        }
      }
      
      if (onPlay) {
        onPlay(game);
      }
    } catch (error) {
      console.error('Error playing game:', error);
      setGameError(true);
    }
  };

  const handleFavorite = () => {
    if (onFavorite) {
      onFavorite(game);
    }
};

  const handleLike = () => {
    if (onFavorite) {
      onFavorite(game);
    }
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };

// Enhanced canvas error monitoring
  useEffect(() => {
    const handleCanvasError = (event) => {
      if (event.target?.tagName === 'CANVAS' || 
          event.message?.includes('canvas') || 
          event.message?.includes('drawImage') ||
          event.message?.includes('InvalidStateError')) {
        console.warn('Canvas error detected in game card:', event);
        setGameError(true);
      }
    };

    const handleUnhandledRejection = (event) => {
      if (event.reason?.message?.includes('canvas') || 
          event.reason?.message?.includes('drawImage')) {
        console.warn('Canvas-related promise rejection:', event.reason);
        setGameError(true);
      }
    };

    window.addEventListener('error', handleCanvasError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    
    return () => {
      window.removeEventListener('error', handleCanvasError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

return (
    <Card 
      ref={cardRef}
      className="game-card relative group overflow-hidden bg-surface border-gray-700 game-container"
      style={{ minWidth: '320px', minHeight: '240px' }}
    >
      <div className="relative aspect-video overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 bg-gray-700 animate-pulse" />
        )}
        {!imageError ? (
          <img
            src={game.thumbnail}
            alt={game.title}
            className="w-full h-full object-cover transition-transform group-hover:scale-110"
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
) : (
          <div className="w-full h-full bg-gray-600 flex items-center justify-center">
            <span className="text-gray-400">No Image</span>
          </div>
        )}
        
        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileHover={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
<Button
              onClick={handlePlay}
              size="lg"
              className="play-button bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 rounded-full w-16 h-16 p-0 opacity-0 group-hover:opacity-100 transition-all duration-300"
              disabled={gameError}
            >
              {gameError ? (
                <ApperIcon name="AlertTriangle" size={24} className="text-error" />
              ) : (
                <ApperIcon name="Play" size={24} className="ml-1" />
              )}
            </Button>
          </motion.div>
</div>
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
<ApperIcon name="Heart" size={16} className={isLiked ? "fill-current" : ""} />
      </motion.button>

      {/* Game Info */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-white truncate mr-2 group-hover:text-primary transition-colors">
            {game.title}
          </h3>
          <div className="flex items-center space-x-1 text-yellow-400">
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
    </Card>
  );
}

export default GameCard;