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
import { adService } from "@/services/api/adService";

const AdManager = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAddingAd, setIsAddingAd] = useState(false);
  const [editingAd, setEditingAd] = useState(null);

  const [adForm, setAdForm] = useState({
    name: "",
    position: "",
    adCode: "",
    isActive: true,
  });

  const adPositions = [
    { value: "header", label: "Header Banner" },
    { value: "sidebar", label: "Sidebar" },
    { value: "between-games", label: "Between Games" },
    { value: "game-detail", label: "Game Detail Page" },
    { value: "footer", label: "Footer" },
    { value: "mobile-banner", label: "Mobile Banner" },
  ];

  useEffect(() => {
    loadAds();
  }, []);

  const loadAds = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await adService.getAll();
      setAds(data);
    } catch (err) {
      setError("Failed to load ads");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const adData = {
        ...adForm,
        impressions: 0,
        clicks: 0,
      };

      if (editingAd) {
        await adService.update(editingAd.Id, adData);
        setAds(ads.map(ad => 
          ad.Id === editingAd.Id ? { ...ad, ...adData } : ad
        ));
        toast.success("Ad updated successfully!");
        setEditingAd(null);
      } else {
        const newAd = await adService.create(adData);
        setAds([...ads, newAd]);
        toast.success("Ad created successfully!");
      }

      setAdForm({
        name: "",
        position: "",
        adCode: "",
        isActive: true,
      });
      setIsAddingAd(false);
    } catch (err) {
      toast.error("Failed to save ad");
    }
  };

  const handleEdit = (ad) => {
    setEditingAd(ad);
    setAdForm({
      name: ad.name,
      position: ad.position,
      adCode: ad.adCode,
      isActive: ad.isActive,
    });
    setIsAddingAd(true);
  };

  const handleDelete = async (adId) => {
    if (window.confirm("Are you sure you want to delete this ad?")) {
      try {
        await adService.delete(adId);
        setAds(ads.filter(ad => ad.Id !== adId));
        toast.success("Ad deleted successfully!");
      } catch (err) {
        toast.error("Failed to delete ad");
      }
    }
  };

  const toggleAdStatus = async (adId) => {
    try {
      const ad = ads.find(a => a.Id === adId);
      await adService.update(adId, { ...ad, isActive: !ad.isActive });
      setAds(ads.map(a => 
        a.Id === adId ? { ...a, isActive: !a.isActive } : a
      ));
      toast.success(`Ad ${ad.isActive ? "deactivated" : "activated"} successfully!`);
    } catch (err) {
      toast.error("Failed to update ad status");
    }
  };

  if (loading) {
    return <Loading type="table" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadAds} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text mb-2">Ad Manager</h1>
          <p className="text-gray-400">Manage your advertising zones and revenue</p>
        </div>
        <Button onClick={() => setIsAddingAd(true)}>
          <ApperIcon name="Plus" size={16} className="mr-2" />
          Add Ad Zone
        </Button>
      </div>

      {/* Revenue Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-success to-green-600 rounded-lg">
              <ApperIcon name="DollarSign" size={24} className="text-white" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">$1,234.56</div>
              <div className="text-sm text-gray-400">This Month</div>
            </div>
          </div>
          <div className="text-sm text-success">+12.3% from last month</div>
        </div>

        <div className="glass-card p-6 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-info to-blue-600 rounded-lg">
              <ApperIcon name="Eye" size={24} className="text-white" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">45,678</div>
              <div className="text-sm text-gray-400">Impressions</div>
            </div>
          </div>
          <div className="text-sm text-info">+8.1% from last month</div>
        </div>

        <div className="glass-card p-6 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-warning to-yellow-600 rounded-lg">
              <ApperIcon name="MousePointer" size={24} className="text-white" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">2.4%</div>
              <div className="text-sm text-gray-400">Click Rate</div>
            </div>
          </div>
          <div className="text-sm text-warning">+0.3% from last month</div>
        </div>
      </div>

      {/* Ads Table */}
      {ads.length === 0 ? (
        <Empty 
          title="No ad zones created"
          message="Set up your first advertising zone to start monetizing your gaming portal."
          action={() => setIsAddingAd(true)}
          actionLabel="Create Ad Zone"
          icon="DollarSign"
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
                  <th className="text-left p-4 text-gray-300 font-medium">Ad Zone</th>
                  <th className="text-left p-4 text-gray-300 font-medium">Position</th>
                  <th className="text-left p-4 text-gray-300 font-medium">Performance</th>
                  <th className="text-left p-4 text-gray-300 font-medium">Status</th>
                  <th className="text-left p-4 text-gray-300 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {ads.map((ad) => (
                  <tr key={ad.Id} className="border-t border-gray-700 hover:bg-gray-800/50">
                    <td className="p-4">
                      <div>
                        <h3 className="font-medium text-white">{ad.name}</h3>
                        <p className="text-sm text-gray-400 truncate max-w-xs">
                          Zone ID: {ad.Id}
                        </p>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant="info" size="sm">
                        {adPositions.find(p => p.value === ad.position)?.label || ad.position}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-gray-400">
                        <div className="flex items-center space-x-2">
                          <ApperIcon name="Eye" size={14} />
                          <span>{ad.impressions || 0}</span>
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          <ApperIcon name="MousePointer" size={14} />
                          <span>{ad.clicks || 0}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge 
                        variant={ad.isActive ? "success" : "default"} 
                        size="sm"
                      >
                        {ad.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleAdStatus(ad.Id)}
                        >
                          <ApperIcon name={ad.isActive ? "Pause" : "Play"} size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(ad)}
                        >
                          <ApperIcon name="Edit" size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(ad.Id)}
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

      {/* Add/Edit Ad Modal */}
      {isAddingAd && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-surface rounded-lg border border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">
                  {editingAd ? "Edit Ad Zone" : "Create New Ad Zone"}
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsAddingAd(false);
                    setEditingAd(null);
                    setAdForm({
                      name: "",
                      position: "",
                      adCode: "",
                      isActive: true,
                    });
                  }}
                >
                  <ApperIcon name="X" size={16} />
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    label="Ad Zone Name"
                    required
                    value={adForm.name}
                    onChange={(e) => setAdForm({ ...adForm, name: e.target.value })}
                    placeholder="e.g., Header Banner"
                  />
                  <FormField
                    label="Position"
                    required
                  >
                    <select
                      value={adForm.position}
                      onChange={(e) => setAdForm({ ...adForm, position: e.target.value })}
                      className="w-full h-10 px-3 py-2 bg-surface border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    >
                      <option value="">Select Position</option>
                      {adPositions.map(position => (
                        <option key={position.value} value={position.value}>
                          {position.label}
                        </option>
                      ))}
                    </select>
                  </FormField>
                </div>

                <FormField
                  label="Ad Code"
                  required
                >
                  <textarea
                    value={adForm.adCode}
                    onChange={(e) => setAdForm({ ...adForm, adCode: e.target.value })}
                    rows={8}
                    className="w-full px-3 py-2 bg-surface border border-gray-600 rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary resize-none font-mono text-sm"
                    placeholder="Paste your ad code here (HTML/JavaScript)"
                    required
                  />
                </FormField>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={adForm.isActive}
                    onChange={(e) => setAdForm({ ...adForm, isActive: e.target.checked })}
                    className="w-4 h-4 text-primary bg-surface border-gray-600 rounded focus:ring-primary"
                  />
                  <label htmlFor="isActive" className="text-sm text-gray-300">
                    Active (show this ad)
                  </label>
                </div>

                <div className="flex space-x-3 pt-4">
                  <Button type="submit" className="flex-1">
                    {editingAd ? "Update Ad Zone" : "Create Ad Zone"}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setIsAddingAd(false);
                      setEditingAd(null);
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

export default AdManager;