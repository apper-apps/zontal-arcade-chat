import adData from "@/services/mockData/adZones.json";

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