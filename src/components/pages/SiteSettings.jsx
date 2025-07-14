import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";

const SiteSettings = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("general");

  const [settings, setSettings] = useState({
    siteName: "Zontal Arcade",
    siteDescription: "The ultimate HTML5 gaming portal",
    siteUrl: "https://zontal-arcade.com",
    adminEmail: "admin@zontal-arcade.com",
    logo: "",
    favicon: "",
    primaryColor: "#6366F1",
    secondaryColor: "#8B5CF6",
    accentColor: "#EC4899",
    enableComments: true,
    enableRegistration: false,
    enableDarkMode: true,
    gamesPerPage: 12,
    featuredGamesCount: 8,
    enableSEO: true,
    googleAnalytics: "",
    googleAdsense: "",
    facebookPixel: "",
    enableCookieConsent: true,
    privacyPolicyUrl: "",
    termsOfServiceUrl: "",
    enableBlog: true,
    enableCategories: true,
    enableSearch: true,
    enableSocialSharing: true,
    facebookUrl: "",
    twitterUrl: "",
    instagramUrl: "",
    youtubeUrl: "",
    enableMaintenance: false,
    maintenanceMessage: "Site is under maintenance. Please check back later.",
    enableAutoImport: false,
    gameDistributionApiKey: "",
    enableGZip: true,
    enableCaching: true,
    cacheExpiration: 3600,
  });

  const tabs = [
    { id: "general", label: "General", icon: "Settings" },
    { id: "appearance", label: "Appearance", icon: "Palette" },
    { id: "features", label: "Features", icon: "Zap" },
    { id: "seo", label: "SEO & Analytics", icon: "Search" },
    { id: "social", label: "Social Media", icon: "Share" },
    { id: "advanced", label: "Advanced", icon: "Code" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Settings saved successfully!");
    } catch (err) {
      toast.error("Failed to save settings");
    } finally {
      setLoading(false);
    }
  };

  const renderGeneralTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Site Name"
          required
          value={settings.siteName}
          onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
        />
        <FormField
          label="Admin Email"
          type="email"
          required
          value={settings.adminEmail}
          onChange={(e) => setSettings({ ...settings, adminEmail: e.target.value })}
        />
      </div>
      
      <FormField
        label="Site Description"
        value={settings.siteDescription}
        onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
      />
      
      <FormField
        label="Site URL"
        type="url"
        value={settings.siteUrl}
        onChange={(e) => setSettings({ ...settings, siteUrl: e.target.value })}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Logo URL"
          value={settings.logo}
          onChange={(e) => setSettings({ ...settings, logo: e.target.value })}
        />
        <FormField
          label="Favicon URL"
          value={settings.favicon}
          onChange={(e) => setSettings({ ...settings, favicon: e.target.value })}
        />
      </div>
    </div>
  );

  const renderAppearanceTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          label="Primary Color"
          type="color"
          value={settings.primaryColor}
          onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
        />
        <FormField
          label="Secondary Color"
          type="color"
          value={settings.secondaryColor}
          onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
        />
        <FormField
          label="Accent Color"
          type="color"
          value={settings.accentColor}
          onChange={(e) => setSettings({ ...settings, accentColor: e.target.value })}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Games Per Page"
          type="number"
          min="1"
          max="50"
          value={settings.gamesPerPage}
          onChange={(e) => setSettings({ ...settings, gamesPerPage: parseInt(e.target.value) })}
        />
        <FormField
          label="Featured Games Count"
          type="number"
          min="1"
          max="20"
          value={settings.featuredGamesCount}
          onChange={(e) => setSettings({ ...settings, featuredGamesCount: parseInt(e.target.value) })}
        />
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="enableDarkMode"
            checked={settings.enableDarkMode}
            onChange={(e) => setSettings({ ...settings, enableDarkMode: e.target.checked })}
            className="w-4 h-4 text-primary bg-surface border-gray-600 rounded focus:ring-primary"
          />
          <label htmlFor="enableDarkMode" className="text-sm text-gray-300">
            Enable Dark Mode
          </label>
        </div>
      </div>
    </div>
  );

  const renderFeaturesTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-white">Core Features</h3>
          {[
            { key: "enableComments", label: "Enable Comments" },
            { key: "enableBlog", label: "Enable Blog System" },
            { key: "enableCategories", label: "Enable Categories" },
            { key: "enableSearch", label: "Enable Search" },
          ].map(feature => (
            <div key={feature.key} className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={feature.key}
                checked={settings[feature.key]}
                onChange={(e) => setSettings({ ...settings, [feature.key]: e.target.checked })}
                className="w-4 h-4 text-primary bg-surface border-gray-600 rounded focus:ring-primary"
              />
              <label htmlFor={feature.key} className="text-sm text-gray-300">
                {feature.label}
              </label>
            </div>
          ))}
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-white">Advanced Features</h3>
          {[
            { key: "enableSocialSharing", label: "Enable Social Sharing" },
            { key: "enableAutoImport", label: "Enable Auto Game Import" },
            { key: "enableCookieConsent", label: "Enable Cookie Consent" },
            { key: "enableMaintenance", label: "Maintenance Mode" },
          ].map(feature => (
            <div key={feature.key} className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={feature.key}
                checked={settings[feature.key]}
                onChange={(e) => setSettings({ ...settings, [feature.key]: e.target.checked })}
                className="w-4 h-4 text-primary bg-surface border-gray-600 rounded focus:ring-primary"
              />
              <label htmlFor={feature.key} className="text-sm text-gray-300">
                {feature.label}
              </label>
            </div>
          ))}
        </div>
      </div>
      
      {settings.enableMaintenance && (
        <FormField
          label="Maintenance Message"
          value={settings.maintenanceMessage}
          onChange={(e) => setSettings({ ...settings, maintenanceMessage: e.target.value })}
        />
      )}
      
      {settings.enableAutoImport && (
        <FormField
          label="GameDistribution API Key"
          value={settings.gameDistributionApiKey}
          onChange={(e) => setSettings({ ...settings, gameDistributionApiKey: e.target.value })}
        />
      )}
    </div>
  );

  const renderSEOTab = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-4">
        <input
          type="checkbox"
          id="enableSEO"
          checked={settings.enableSEO}
          onChange={(e) => setSettings({ ...settings, enableSEO: e.target.checked })}
          className="w-4 h-4 text-primary bg-surface border-gray-600 rounded focus:ring-primary"
        />
        <label htmlFor="enableSEO" className="text-sm text-gray-300">
          Enable SEO Optimization
        </label>
      </div>
      
      <FormField
        label="Google Analytics ID"
        placeholder="G-XXXXXXXXXX"
        value={settings.googleAnalytics}
        onChange={(e) => setSettings({ ...settings, googleAnalytics: e.target.value })}
      />
      
      <FormField
        label="Google AdSense Publisher ID"
        placeholder="ca-pub-XXXXXXXXXXXXXXXX"
        value={settings.googleAdsense}
        onChange={(e) => setSettings({ ...settings, googleAdsense: e.target.value })}
      />
      
      <FormField
        label="Facebook Pixel ID"
        value={settings.facebookPixel}
        onChange={(e) => setSettings({ ...settings, facebookPixel: e.target.value })}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Privacy Policy URL"
          type="url"
          value={settings.privacyPolicyUrl}
          onChange={(e) => setSettings({ ...settings, privacyPolicyUrl: e.target.value })}
        />
        <FormField
          label="Terms of Service URL"
          type="url"
          value={settings.termsOfServiceUrl}
          onChange={(e) => setSettings({ ...settings, termsOfServiceUrl: e.target.value })}
        />
      </div>
    </div>
  );

  const renderSocialTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Facebook URL"
          type="url"
          value={settings.facebookUrl}
          onChange={(e) => setSettings({ ...settings, facebookUrl: e.target.value })}
        />
        <FormField
          label="Twitter URL"
          type="url"
          value={settings.twitterUrl}
          onChange={(e) => setSettings({ ...settings, twitterUrl: e.target.value })}
        />
        <FormField
          label="Instagram URL"
          type="url"
          value={settings.instagramUrl}
          onChange={(e) => setSettings({ ...settings, instagramUrl: e.target.value })}
        />
        <FormField
          label="YouTube URL"
          type="url"
          value={settings.youtubeUrl}
          onChange={(e) => setSettings({ ...settings, youtubeUrl: e.target.value })}
        />
      </div>
    </div>
  );

  const renderAdvancedTab = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-white">Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            {[
              { key: "enableGZip", label: "Enable GZip Compression" },
              { key: "enableCaching", label: "Enable Caching" },
            ].map(feature => (
              <div key={feature.key} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={feature.key}
                  checked={settings[feature.key]}
                  onChange={(e) => setSettings({ ...settings, [feature.key]: e.target.checked })}
                  className="w-4 h-4 text-primary bg-surface border-gray-600 rounded focus:ring-primary"
                />
                <label htmlFor={feature.key} className="text-sm text-gray-300">
                  {feature.label}
                </label>
              </div>
            ))}
          </div>
          
          <div>
            <FormField
              label="Cache Expiration (seconds)"
              type="number"
              min="60"
              max="86400"
              value={settings.cacheExpiration}
              onChange={(e) => setSettings({ ...settings, cacheExpiration: parseInt(e.target.value) })}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "general":
        return renderGeneralTab();
      case "appearance":
        return renderAppearanceTab();
      case "features":
        return renderFeaturesTab();
      case "seo":
        return renderSEOTab();
      case "social":
        return renderSocialTab();
      case "advanced":
        return renderAdvancedTab();
      default:
        return renderGeneralTab();
    }
  };

  if (error) {
    return <Error message={error} onRetry={() => setError("")} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text mb-2">Site Settings</h1>
          <p className="text-gray-400">Configure your gaming portal settings</p>
        </div>
        <div className="flex space-x-3 mt-4 sm:mt-0">
          <Button variant="ghost" size="sm">
            <ApperIcon name="RefreshCw" size={16} className="mr-2" />
            Reset to Defaults
          </Button>
          <Button variant="ghost" size="sm">
            <ApperIcon name="Download" size={16} className="mr-2" />
            Export Settings
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings Tabs */}
        <div className="lg:col-span-1">
          <div className="bg-surface rounded-lg border border-gray-700 p-4">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-primary/20 to-secondary/20 text-primary border border-primary/30"
                      : "text-gray-400 hover:text-white hover:bg-gray-800"
                  }`}
                >
                  <ApperIcon name={tab.icon} size={16} />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          <form onSubmit={handleSubmit}>
            <div className="bg-surface rounded-lg border border-gray-700 p-6">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                {renderTabContent()}
              </motion.div>
              
              <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-700">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => window.location.reload()}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <ApperIcon name="Save" size={16} className="mr-2" />
                      Save Settings
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SiteSettings;