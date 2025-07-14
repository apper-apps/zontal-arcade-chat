import categoryData from "@/services/mockData/categories.json";

let categories = [...categoryData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const categoryService = {
  async getAll() {
    await delay(250);
    return categories.map(category => ({ ...category }));
  },

  async getById(id) {
    await delay(200);
    const category = categories.find(c => c.Id === id);
    return category ? { ...category } : null;
  },

  async create(categoryData) {
    await delay(350);
    const newCategory = {
      ...categoryData,
      Id: Math.max(...categories.map(c => c.Id)) + 1,
    };
    categories.push(newCategory);
    return { ...newCategory };
  },

  async update(id, categoryData) {
    await delay(300);
    const index = categories.findIndex(c => c.Id === id);
    if (index !== -1) {
      categories[index] = { ...categories[index], ...categoryData };
      return { ...categories[index] };
    }
    throw new Error("Category not found");
  },

  async delete(id) {
    await delay(250);
    const index = categories.findIndex(c => c.Id === id);
    if (index !== -1) {
      categories.splice(index, 1);
      return true;
    }
    throw new Error("Category not found");
  },
};