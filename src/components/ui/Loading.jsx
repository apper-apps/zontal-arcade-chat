import { motion } from "framer-motion";

const Loading = ({ type = "cards", count = 6 }) => {
  const renderCardSkeleton = () => (
    <div className="bg-surface rounded-lg p-4 border border-gray-700">
      <div className="shimmer h-40 rounded-lg mb-4"></div>
      <div className="shimmer h-4 rounded mb-2"></div>
      <div className="shimmer h-3 rounded w-3/4 mb-3"></div>
      <div className="flex justify-between items-center">
        <div className="shimmer h-6 w-16 rounded-full"></div>
        <div className="shimmer h-8 w-8 rounded-full"></div>
      </div>
    </div>
  );

  const renderTableSkeleton = () => (
    <div className="bg-surface rounded-lg border border-gray-700">
      <div className="p-4 border-b border-gray-700">
        <div className="shimmer h-6 w-48 rounded"></div>
      </div>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="p-4 border-b border-gray-700 last:border-b-0">
          <div className="flex items-center space-x-4">
            <div className="shimmer h-12 w-12 rounded-lg"></div>
            <div className="flex-1">
              <div className="shimmer h-4 rounded mb-2"></div>
              <div className="shimmer h-3 rounded w-2/3"></div>
            </div>
            <div className="shimmer h-8 w-20 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderDashboardSkeleton = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-surface rounded-lg p-6 border border-gray-700">
            <div className="shimmer h-8 w-8 rounded-lg mb-4"></div>
            <div className="shimmer h-8 w-20 rounded mb-2"></div>
            <div className="shimmer h-4 w-24 rounded"></div>
          </div>
        ))}
      </div>
      <div className="bg-surface rounded-lg p-6 border border-gray-700">
        <div className="shimmer h-6 w-32 rounded mb-4"></div>
        <div className="shimmer h-64 rounded-lg"></div>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      {type === "cards" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: count }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              {renderCardSkeleton()}
            </motion.div>
          ))}
        </div>
      )}

      {type === "table" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {renderTableSkeleton()}
        </motion.div>
      )}

      {type === "dashboard" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {renderDashboardSkeleton()}
        </motion.div>
      )}
    </motion.div>
  );
};

export default Loading;