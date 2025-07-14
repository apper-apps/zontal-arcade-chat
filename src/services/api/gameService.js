// Mock game data
const gameData = [
  {
    id: 1,
    title: "Space Adventure",
    description: "An epic space exploration game with stunning graphics",
    thumbnail: "/images/games/space-adventure.jpg",
    category: "Action",
    categoryId: 1,
    rating: 4.8,
    plays: 15420,
    featured: true,
    tags: ["space", "adventure", "action"],
    gameUrl: "/games/space-adventure",
    developer: "Stellar Games",
    releaseDate: "2024-01-15",
    size: "45 MB"
  },
  {
    id: 2,
    title: "Puzzle Master",
    description: "Challenge your mind with increasingly difficult puzzles",
    thumbnail: "/images/games/puzzle-master.jpg",
    category: "Puzzle",
    categoryId: 2,
    rating: 4.6,
    plays: 8950,
    featured: true,
    tags: ["puzzle", "brain", "logic"],
    gameUrl: "/games/puzzle-master",
    developer: "Mind Games Studio",
    releaseDate: "2024-02-20",
    size: "12 MB"
  },
  {
    id: 3,
    title: "Racing Thunder",
    description: "High-speed racing with customizable cars",
    thumbnail: "/images/games/racing-thunder.jpg",
    category: "Racing",
    categoryId: 3,
    rating: 4.7,
    plays: 12300,
    featured: false,
    tags: ["racing", "cars", "speed"],
    gameUrl: "/games/racing-thunder",
    developer: "Speed Demons",
    releaseDate: "2024-03-10",
    size: "78 MB"
  },
  {
    id: 4,
    title: "Fantasy Quest",
    description: "Embark on a magical journey through enchanted lands",
    thumbnail: "/images/games/fantasy-quest.jpg",
    category: "RPG",
    categoryId: 4,
    rating: 4.9,
    plays: 22100,
    featured: true,
    tags: ["fantasy", "rpg", "adventure"],
    gameUrl: "/games/fantasy-quest",
    developer: "Mystic Realms",
    releaseDate: "2024-01-05",
    size: "156 MB"
  },
  {
    id: 5,
    title: "Arcade Shooter",
    description: "Classic arcade-style shooting action",
    thumbnail: "/images/games/arcade-shooter.jpg",
    category: "Action",
    categoryId: 1,
    rating: 4.4,
    plays: 7800,
    featured: false,
    tags: ["arcade", "shooter", "retro"],
    gameUrl: "/games/arcade-shooter",
    developer: "Retro Studios",
    releaseDate: "2024-02-28",
    size: "23 MB"
  }
];

let games = [...gameData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const gameService = {
  async getAll() {
    await delay(300);
    return games.map(game => ({ ...game }));
  },

  async getById(id) {
    await delay(200);
    const game = games.find(g => g.Id === id);
    return game ? { ...game } : null;
  },

  async create(gameData) {
    await delay(400);
    const newGame = {
      ...gameData,
      Id: Math.max(...games.map(g => g.Id)) + 1,
    };
    games.push(newGame);
    return { ...newGame };
  },

  async update(id, gameData) {
    await delay(350);
    const index = games.findIndex(g => g.Id === id);
    if (index !== -1) {
      games[index] = { ...games[index], ...gameData };
      return { ...games[index] };
    }
    throw new Error("Game not found");
  },

  async delete(id) {
    await delay(300);
    const index = games.findIndex(g => g.Id === id);
    if (index !== -1) {
      games.splice(index, 1);
      return true;
    }
    throw new Error("Game not found");
  },
};