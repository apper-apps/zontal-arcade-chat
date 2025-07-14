// Mock category data
const categoryData = [
  {
    id: 1,
    name: "Action",
    description: "Fast-paced games with intense gameplay",
    slug: "action",
    icon: "⚔️",
    color: "#EF4444",
    gameCount: 45,
    featured: true,
    thumbnail: "/images/categories/action.jpg"
  },
  {
    id: 2,
    name: "Puzzle",
    description: "Mind-bending puzzles and brain teasers",
    slug: "puzzle",
    icon: "🧩",
    color: "#8B5CF6",
    gameCount: 32,
    featured: true,
    thumbnail: "/images/categories/puzzle.jpg"
  },
  {
    id: 3,
    name: "Racing",
    description: "High-speed racing and driving games",
    slug: "racing",
    icon: "🏎️",
    color: "#F59E0B",
    gameCount: 28,
    featured: true,
    thumbnail: "/images/categories/racing.jpg"
  },
  {
    id: 4,
    name: "RPG",
    description: "Role-playing games with rich storylines",
    slug: "rpg",
    icon: "🗡️",
    color: "#10B981",
    gameCount: 21,
    featured: true,
    thumbnail: "/images/categories/rpg.jpg"
  },
  {
    id: 5,
    name: "Sports",
    description: "Sports games and athletic competitions",
    slug: "sports",
    icon: "⚽",
    color: "#3B82F6",
    gameCount: 19,
    featured: false,
    thumbnail: "/images/categories/sports.jpg"
  },
  {
    id: 6,
    name: "Adventure",
    description: "Explore vast worlds and epic quests",
    slug: "adventure",
    icon: "🗺️",
    color: "#EC4899",
    gameCount: 35,
    featured: true,
    thumbnail: "/images/categories/adventure.jpg"
  }
];

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