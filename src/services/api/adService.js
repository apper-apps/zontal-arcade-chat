// Mock ad zone data
const adData = [
  {
    id: 1,
    name: "Header Banner",
    zone: "header",
    type: "banner",
    dimensions: "728x90",
    active: true,
    priority: 1,
    content: {
      title: "Premium Gaming Experience",
      subtitle: "Upgrade to Pro for unlimited access",
      image: "/images/ads/header-banner.jpg",
      link: "/premium",
      cta: "Upgrade Now"
    },
    targeting: {
      categories: ["all"],
      devices: ["desktop", "tablet"]
    },
    stats: {
      impressions: 15420,
      clicks: 892,
      ctr: 5.8
    }
  },
  {
    id: 2,
    name: "Sidebar Square",
    zone: "sidebar",
    type: "square",
    dimensions: "300x250",
    active: true,
    priority: 2,
    content: {
      title: "New Games Daily",
      subtitle: "Fresh content every day",
      image: "/images/ads/sidebar-square.jpg",
      link: "/new-games",
      cta: "Explore Now"
    },
    targeting: {
      categories: ["action", "adventure"],
      devices: ["desktop"]
    },
    stats: {
      impressions: 8950,
      clicks: 445,
      ctr: 4.9
    }
  },
  {
    id: 3,
    name: "Mobile Banner",
    zone: "mobile-footer",
    type: "banner",
    dimensions: "320x50",
    active: true,
    priority: 3,
    content: {
      title: "Play on Mobile",
      subtitle: "Download our app",
      image: "/images/ads/mobile-banner.jpg",
      link: "/mobile-app",
      cta: "Download"
    },
    targeting: {
      categories: ["all"],
      devices: ["mobile"]
    },
    stats: {
      impressions: 12300,
      clicks: 738,
      ctr: 6.0
    }
  },
  {
    id: 4,
    name: "Interstitial",
    zone: "interstitial",
    type: "fullscreen",
    dimensions: "100vw x 100vh",
    active: false,
    priority: 4,
    content: {
      title: "Special Offer",
      subtitle: "50% off premium features",
      image: "/images/ads/interstitial.jpg",
      link: "/special-offer",
      cta: "Claim Now"
    },
    targeting: {
      categories: ["all"],
      devices: ["desktop", "tablet", "mobile"]
    },
    stats: {
      impressions: 3200,
      clicks: 256,
      ctr: 8.0
    }
  },
  {
    id: 5,
    name: "Game End Screen",
    zone: "game-end",
    type: "overlay",
    dimensions: "400x300",
    active: true,
    priority: 5,
    content: {
      title: "Play More Games",
      subtitle: "Discover similar games",
      image: "/images/ads/game-end.jpg",
      link: "/recommended",
      cta: "Play More"
    },
    targeting: {
      categories: ["all"],
      devices: ["desktop", "tablet", "mobile"]
    },
    stats: {
      impressions: 6800,
      clicks: 408,
      ctr: 6.0
    }
  }
];

let adZones = [...adData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const adService = {
  async getAll() {
    await delay(250);
    return adZones.map(ad => ({ ...ad }));
  },

  async getById(id) {
    await delay(200);
    const ad = adZones.find(a => a.Id === id);
    return ad ? { ...ad } : null;
  },

  async create(adData) {
    await delay(350);
    const newAd = {
      ...adData,
      Id: Math.max(...adZones.map(a => a.Id)) + 1,
    };
    adZones.push(newAd);
    return { ...newAd };
  },

  async update(id, adData) {
    await delay(300);
    const index = adZones.findIndex(a => a.Id === id);
    if (index !== -1) {
      adZones[index] = { ...adZones[index], ...adData };
      return { ...adZones[index] };
    }
    throw new Error("Ad zone not found");
  },

  async delete(id) {
    await delay(250);
    const index = adZones.findIndex(a => a.Id === id);
    if (index !== -1) {
      adZones.splice(index, 1);
      return true;
    }
    throw new Error("Ad zone not found");
  },
};