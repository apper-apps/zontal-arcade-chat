import gameData from "@/services/mockData/games.json";

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