import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const CategoryCard = ({ category, className }) => {
  const getGradient = (index) => {
    const gradients = [
      "from-primary to-secondary",
      "from-secondary to-accent",
      "from-accent to-primary",
      "from-info to-primary",
      "from-success to-info",
      "from-warning to-accent",
    ];
    return gradients[index % gradients.length];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className={cn("group", className)}
    >
      <Link to={`/category/${category.slug}`}>
        <div className="category-badge bg-surface rounded-lg p-6 border border-gray-700 hover:border-primary/50 transition-all duration-300 text-center">
          <div className={cn(
            "w-16 h-16 rounded-full bg-gradient-to-br mx-auto mb-4 flex items-center justify-center",
            getGradient(category.Id)
          )}>
            <ApperIcon name={category.icon} size={24} className="text-white" />
          </div>
          
          <h3 className="font-semibold text-white mb-2 group-hover:text-primary transition-colors">
            {category.name}
          </h3>
          
          <p className="text-sm text-gray-400">
            {category.gameCount} games
          </p>
        </div>
      </Link>
    </motion.div>
  );
};

export default CategoryCard;