import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { categoryService } from "@/services/api/categoryService";

const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const [categoryForm, setCategoryForm] = useState({
    name: "",
    icon: "Grid3x3",
    gameCount: 0,
    order: 0,
  });

  const availableIcons = [
    "Grid3x3", "Zap", "Target", "Car", "Puzzle", "Swords", "Trophy", "Gamepad2",
    "Sparkles", "Rocket", "Heart", "Music", "Brain", "Crosshair", "Crown", "Gem"
  ];

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (err) {
      setError("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const categoryData = {
        ...categoryForm,
        slug: categoryForm.name.toLowerCase().replace(/\s+/g, "-"),
      };

      if (editingCategory) {
        await categoryService.update(editingCategory.Id, categoryData);
        setCategories(categories.map(cat => 
          cat.Id === editingCategory.Id ? { ...cat, ...categoryData } : cat
        ));
        toast.success("Category updated successfully!");
        setEditingCategory(null);
      } else {
        const newCategory = await categoryService.create(categoryData);
        setCategories([...categories, newCategory]);
        toast.success("Category added successfully!");
      }

      setCategoryForm({
        name: "",
        icon: "Grid3x3",
        gameCount: 0,
        order: 0,
      });
      setIsAddingCategory(false);
    } catch (err) {
      toast.error("Failed to save category");
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setCategoryForm({
      name: category.name,
      icon: category.icon,
      gameCount: category.gameCount,
      order: category.order,
    });
    setIsAddingCategory(true);
  };

  const handleDelete = async (categoryId) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await categoryService.delete(categoryId);
        setCategories(categories.filter(cat => cat.Id !== categoryId));
        toast.success("Category deleted successfully!");
      } catch (err) {
        toast.error("Failed to delete category");
      }
    }
  };

  if (loading) {
    return <Loading type="table" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadCategories} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text mb-2">Category Manager</h1>
          <p className="text-gray-400">Organize your games into categories</p>
        </div>
        <Button onClick={() => setIsAddingCategory(true)}>
          <ApperIcon name="Plus" size={16} className="mr-2" />
          Add Category
        </Button>
      </div>

      {/* Categories Grid */}
      {categories.length === 0 ? (
        <Empty 
          type="categories"
          action={() => setIsAddingCategory(true)}
          actionLabel="Add First Category"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category) => (
            <motion.div
              key={category.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5 }}
              className="bg-surface rounded-lg p-6 border border-gray-700 hover:border-primary/50 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                  <ApperIcon name={category.icon} size={20} className="text-white" />
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(category)}
                  >
                    <ApperIcon name="Edit" size={14} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(category.Id)}
                    className="text-error hover:text-error hover:bg-error/20"
                  >
                    <ApperIcon name="Trash" size={14} />
                  </Button>
                </div>
              </div>
              
              <h3 className="font-semibold text-white mb-2">{category.name}</h3>
              <p className="text-sm text-gray-400 mb-3">{category.gameCount} games</p>
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Order: {category.order}</span>
                <span>/{category.slug}</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add/Edit Category Modal */}
      {isAddingCategory && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-surface rounded-lg border border-gray-700 w-full max-w-md"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">
                  {editingCategory ? "Edit Category" : "Add New Category"}
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsAddingCategory(false);
                    setEditingCategory(null);
                    setCategoryForm({
                      name: "",
                      icon: "Grid3x3",
                      gameCount: 0,
                      order: 0,
                    });
                  }}
                >
                  <ApperIcon name="X" size={16} />
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <FormField
                  label="Category Name"
                  required
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                />

                <FormField label="Icon">
                  <div className="grid grid-cols-8 gap-2">
                    {availableIcons.map(icon => (
                      <button
                        key={icon}
                        type="button"
                        onClick={() => setCategoryForm({ ...categoryForm, icon })}
                        className={`p-2 rounded-lg border-2 transition-all ${
                          categoryForm.icon === icon 
                            ? "border-primary bg-primary/20" 
                            : "border-gray-600 hover:border-gray-500"
                        }`}
                      >
                        <ApperIcon name={icon} size={16} className="text-gray-300" />
                      </button>
                    ))}
                  </div>
                </FormField>

                <FormField
                  label="Display Order"
                  type="number"
                  value={categoryForm.order}
                  onChange={(e) => setCategoryForm({ ...categoryForm, order: parseInt(e.target.value) || 0 })}
                />

                <div className="flex space-x-3 pt-4">
                  <Button type="submit" className="flex-1">
                    {editingCategory ? "Update Category" : "Add Category"}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setIsAddingCategory(false);
                      setEditingCategory(null);
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

export default CategoryManager;