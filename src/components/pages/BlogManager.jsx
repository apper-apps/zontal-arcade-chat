import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { blogService } from "@/services/api/blogService";

const BlogManager = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAddingPost, setIsAddingPost] = useState(false);
  const [editingPost, setEditingPost] = useState(null);

  const [postForm, setPostForm] = useState({
    title: "",
    content: "",
    excerpt: "",
    featuredImage: "",
    category: "",
    tags: "",
    seoTitle: "",
    seoDescription: "",
  });

  const blogCategories = [
    "News", "Reviews", "Tutorials", "Updates", "Events", "Tips"
  ];

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await blogService.getAll();
      setPosts(data);
    } catch (err) {
      setError("Failed to load blog posts");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const postData = {
        ...postForm,
        slug: postForm.title.toLowerCase().replace(/\s+/g, "-"),
        tags: postForm.tags.split(",").map(tag => tag.trim()),
        publishedAt: new Date().toISOString(),
      };

      if (editingPost) {
        await blogService.update(editingPost.Id, postData);
        setPosts(posts.map(post => 
          post.Id === editingPost.Id ? { ...post, ...postData } : post
        ));
        toast.success("Post updated successfully!");
        setEditingPost(null);
      } else {
        const newPost = await blogService.create(postData);
        setPosts([...posts, newPost]);
        toast.success("Post published successfully!");
      }

      setPostForm({
        title: "",
        content: "",
        excerpt: "",
        featuredImage: "",
        category: "",
        tags: "",
        seoTitle: "",
        seoDescription: "",
      });
      setIsAddingPost(false);
    } catch (err) {
      toast.error("Failed to save post");
    }
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setPostForm({
      title: post.title,
      content: post.content,
      excerpt: post.excerpt,
      featuredImage: post.featuredImage,
      category: post.category,
      tags: Array.isArray(post.tags) ? post.tags.join(", ") : post.tags || "",
      seoTitle: post.seoTitle,
      seoDescription: post.seoDescription,
    });
    setIsAddingPost(true);
  };

  const handleDelete = async (postId) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await blogService.delete(postId);
        setPosts(posts.filter(post => post.Id !== postId));
        toast.success("Post deleted successfully!");
      } catch (err) {
        toast.error("Failed to delete post");
      }
    }
  };

  if (loading) {
    return <Loading type="table" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadPosts} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text mb-2">Blog Manager</h1>
          <p className="text-gray-400">Create and manage your blog content</p>
        </div>
        <Button onClick={() => setIsAddingPost(true)}>
          <ApperIcon name="Plus" size={16} className="mr-2" />
          New Post
        </Button>
      </div>

      {/* Posts Table */}
      {posts.length === 0 ? (
        <Empty 
          type="blog"
          action={() => setIsAddingPost(true)}
          actionLabel="Write First Post"
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
                  <th className="text-left p-4 text-gray-300 font-medium">Post</th>
                  <th className="text-left p-4 text-gray-300 font-medium">Category</th>
                  <th className="text-left p-4 text-gray-300 font-medium">Published</th>
                  <th className="text-left p-4 text-gray-300 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.Id} className="border-t border-gray-700 hover:bg-gray-800/50">
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        {post.featuredImage && (
                          <img
                            src={post.featuredImage}
                            alt={post.title}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        )}
                        <div>
                          <h3 className="font-medium text-white">{post.title}</h3>
                          <p className="text-sm text-gray-400 truncate max-w-xs">
                            {post.excerpt}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant="default" size="sm">
                        {post.category}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-gray-400">
                        {new Date(post.publishedAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(post)}
                        >
                          <ApperIcon name="Edit" size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(post.Id)}
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

      {/* Add/Edit Post Modal */}
      {isAddingPost && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-surface rounded-lg border border-gray-700 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">
                  {editingPost ? "Edit Post" : "Create New Post"}
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsAddingPost(false);
                    setEditingPost(null);
                    setPostForm({
                      title: "",
                      content: "",
                      excerpt: "",
                      featuredImage: "",
                      category: "",
                      tags: "",
                      seoTitle: "",
                      seoDescription: "",
                    });
                  }}
                >
                  <ApperIcon name="X" size={16} />
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    label="Post Title"
                    required
                    value={postForm.title}
                    onChange={(e) => setPostForm({ ...postForm, title: e.target.value })}
                  />
                  <FormField
                    label="Category"
                    required
                  >
                    <select
                      value={postForm.category}
                      onChange={(e) => setPostForm({ ...postForm, category: e.target.value })}
                      className="w-full h-10 px-3 py-2 bg-surface border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    >
                      <option value="">Select Category</option>
                      {blogCategories.map(category => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </FormField>
                </div>

                <FormField
                  label="Excerpt"
                  required
                >
                  <textarea
                    value={postForm.excerpt}
                    onChange={(e) => setPostForm({ ...postForm, excerpt: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 bg-surface border border-gray-600 rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    placeholder="Brief description of the post..."
                    required
                  />
                </FormField>

                <FormField
                  label="Content"
                  required
                >
                  <textarea
                    value={postForm.content}
                    onChange={(e) => setPostForm({ ...postForm, content: e.target.value })}
                    rows={8}
                    className="w-full px-3 py-2 bg-surface border border-gray-600 rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    placeholder="Write your post content here..."
                    required
                  />
                </FormField>

                <FormField
                  label="Featured Image URL"
                  value={postForm.featuredImage}
                  onChange={(e) => setPostForm({ ...postForm, featuredImage: e.target.value })}
                />

                <FormField
                  label="Tags (comma-separated)"
                  value={postForm.tags}
                  onChange={(e) => setPostForm({ ...postForm, tags: e.target.value })}
                />

                <div className="border-t border-gray-700 pt-4">
                  <h3 className="text-lg font-medium text-white mb-4">SEO Settings</h3>
                  <div className="space-y-4">
                    <FormField
                      label="SEO Title"
                      value={postForm.seoTitle}
                      onChange={(e) => setPostForm({ ...postForm, seoTitle: e.target.value })}
                    />
                    <FormField
                      label="SEO Description"
                    >
                      <textarea
                        value={postForm.seoDescription}
                        onChange={(e) => setPostForm({ ...postForm, seoDescription: e.target.value })}
                        rows={2}
                        className="w-full px-3 py-2 bg-surface border border-gray-600 rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                        placeholder="Meta description for search engines..."
                      />
                    </FormField>
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <Button type="submit" className="flex-1">
                    {editingPost ? "Update Post" : "Publish Post"}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setIsAddingPost(false);
                      setEditingPost(null);
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

export default BlogManager;