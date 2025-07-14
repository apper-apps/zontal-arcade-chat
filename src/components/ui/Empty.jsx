import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No items found", 
  message = "There are no items to display at the moment.", 
  action, 
  actionLabel = "Add New",
  icon = "Package",
  type = "general" 
}) => {
  const getEmptyContent = () => {
    switch (type) {
      case "games":
        return {
          icon: "Gamepad2",
          title: "No games found",
          message: "Start building your gaming portal by adding some awesome HTML5 games!"
        };
      case "categories":
        return {
          icon: "Grid3x3",
          title: "No categories created",
          message: "Organize your games by creating categories that players can easily browse."
        };
      case "blog":
        return {
          icon: "FileText",
          title: "No blog posts yet",
          message: "Share news, updates, and gaming content with your audience by creating blog posts."
        };
      case "search":
        return {
          icon: "Search",
          title: "No results found",
          message: "Try adjusting your search terms or browse our game categories."
        };
      case "comments":
        return {
          icon: "MessageCircle",
          title: "No comments yet",
          message: "Be the first to share your thoughts about this game!"
        };
      default:
        return { icon, title, message };
    }
  };

  const content = getEmptyContent();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center min-h-[400px] text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
        className="mb-6"
      >
        <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mb-4">
          <ApperIcon name={content.icon} size={32} className="text-white" />
        </div>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-2xl font-bold text-white mb-2"
      >
        {content.title}
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-gray-400 mb-6 max-w-md"
      >
        {content.message}
      </motion.p>

      {action && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Button
            onClick={action}
            className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
          >
            <ApperIcon name="Plus" size={16} className="mr-2" />
            {actionLabel}
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Empty;