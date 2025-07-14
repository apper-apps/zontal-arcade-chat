import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import { blogService } from "@/services/api/blogService";

const BlogPostDetail = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadPostData();
  }, [slug]);

  const loadPostData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const posts = await blogService.getAll();
      const postData = posts.find(p => p.slug === slug);
      
      if (!postData) {
        setError("Blog post not found");
        return;
      }

      setPost(postData);
      
      // Load related posts (same category)
      const related = posts
        .filter(p => p.category === postData.category && p.Id !== postData.Id)
        .slice(0, 3);
      setRelatedPosts(related);
    } catch (err) {
      setError("Failed to load blog post");
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async (platform) => {
    const url = window.location.href;
    const title = post.title;
    
    let shareUrl = "";
    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
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

  if (loading) {
    return <Loading type="cards" count={1} />;
  }

  if (error) {
    return <Error message={error} onRetry={loadPostData} type="notFound" />;
  }

  if (!post) {
    return <Error message="Blog post not found" type="notFound" />;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <article>
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-400 mb-8">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <ApperIcon name="ChevronRight" size={16} />
          <Link to="/blog" className="hover:text-white transition-colors">Blog</Link>
          <ApperIcon name="ChevronRight" size={16} />
          <span className="text-white truncate">{post.title}</span>
        </nav>

        {/* Article Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-4 mb-4">
            <Badge variant="primary">{post.category}</Badge>
            <span className="text-gray-400">
              {new Date(post.publishedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric"
              })}
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
            {post.title}
          </h1>
          
          <p className="text-xl text-gray-300 leading-relaxed">
            {post.excerpt}
          </p>
        </motion.header>

        {/* Featured Image */}
        {post.featuredImage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <img
              src={post.featuredImage}
              alt={post.title}
              className="w-full h-64 md:h-96 object-cover rounded-lg"
            />
          </motion.div>
        )}

        {/* Article Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="prose prose-invert prose-lg max-w-none mb-8"
        >
          <div className="text-gray-300 leading-relaxed space-y-4">
            {post.content.split("\n\n").map((paragraph, index) => (
              <p key={index} className="mb-4">
                {paragraph}
              </p>
            ))}
          </div>
        </motion.div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <Badge key={index} variant="default" size="sm">
                  {tag}
                </Badge>
              ))}
            </div>
          </motion.div>
        )}

        {/* Share Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex items-center justify-between p-6 bg-surface rounded-lg border border-gray-700 mb-8"
        >
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Share this article</h3>
            <p className="text-gray-400">Help others discover this content</p>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleShare("facebook")}
            >
              <ApperIcon name="Facebook" size={16} />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleShare("twitter")}
            >
              <ApperIcon name="Twitter" size={16} />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleShare("linkedin")}
            >
              <ApperIcon name="Linkedin" size={16} />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleShare("copy")}
            >
              <ApperIcon name="Copy" size={16} />
            </Button>
          </div>
        </motion.div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map((relatedPost, index) => (
              <motion.div
                key={relatedPost.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
              >
                <Link to={`/blog/${relatedPost.slug}`}>
                  <div className="bg-surface rounded-lg overflow-hidden border border-gray-700 hover:border-primary/50 transition-all duration-300 group">
                    {relatedPost.featuredImage && (
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={relatedPost.featuredImage}
                          alt={relatedPost.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="primary" size="sm">
                          {relatedPost.category}
                        </Badge>
                        <span className="text-xs text-gray-400">
                          {new Date(relatedPost.publishedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="font-semibold text-white mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {relatedPost.title}
                      </h3>
                      <p className="text-sm text-gray-400 line-clamp-2">
                        {relatedPost.excerpt}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {/* Back to Blog */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mt-12 text-center"
      >
        <Link to="/blog">
          <Button variant="secondary">
            <ApperIcon name="ArrowLeft" size={16} className="mr-2" />
            Back to Blog
          </Button>
        </Link>
      </motion.div>
    </div>
  );
};

export default BlogPostDetail;