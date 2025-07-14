import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import AdminLayout from "@/components/organisms/AdminLayout";
import FrontendLayout from "@/components/organisms/FrontendLayout";
import AdminDashboard from "@/components/pages/AdminDashboard";
import GameManager from "@/components/pages/GameManager";
import CategoryManager from "@/components/pages/CategoryManager";
import BlogManager from "@/components/pages/BlogManager";
import AdManager from "@/components/pages/AdManager";
import SiteSettings from "@/components/pages/SiteSettings";
import Home from "@/components/pages/Home";
import GameDetail from "@/components/pages/GameDetail";
import CategoryGames from "@/components/pages/CategoryGames";
import BlogPage from "@/components/pages/BlogPage";
import BlogPostDetail from "@/components/pages/BlogPostDetail";
import SearchResults from "@/components/pages/SearchResults";

function App() {
  return (
    <div className="min-h-screen bg-background text-white">
      <Routes>
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="games" element={<GameManager />} />
          <Route path="categories" element={<CategoryManager />} />
          <Route path="blog" element={<BlogManager />} />
          <Route path="ads" element={<AdManager />} />
          <Route path="settings" element={<SiteSettings />} />
        </Route>
        
        {/* Frontend Routes */}
        <Route path="/" element={<FrontendLayout />}>
          <Route index element={<Home />} />
          <Route path="game/:slug" element={<GameDetail />} />
          <Route path="category/:slug" element={<CategoryGames />} />
          <Route path="blog" element={<BlogPage />} />
          <Route path="blog/:slug" element={<BlogPostDetail />} />
          <Route path="search" element={<SearchResults />} />
        </Route>
        
        {/* Redirect root to admin */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
}

export default App;