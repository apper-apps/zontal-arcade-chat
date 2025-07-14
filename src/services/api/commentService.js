import commentData from "@/services/mockData/comments.json";

let comments = [...commentData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const commentService = {
  async getAll() {
    await delay(250);
    return comments.map(comment => ({ ...comment }));
  },

  async getByGameId(gameId) {
    await delay(200);
    return comments
      .filter(comment => comment.gameId === gameId && comment.status === "approved")
      .map(comment => ({ ...comment }));
  },

  async getById(id) {
    await delay(200);
    const comment = comments.find(c => c.Id === id);
    return comment ? { ...comment } : null;
  },

  async create(commentData) {
    await delay(350);
    const newComment = {
      ...commentData,
      Id: Math.max(...comments.map(c => c.Id)) + 1,
      createdAt: new Date().toISOString(),
    };
    comments.push(newComment);
    return { ...newComment };
  },

  async update(id, commentData) {
    await delay(300);
    const index = comments.findIndex(c => c.Id === id);
    if (index !== -1) {
      comments[index] = { ...comments[index], ...commentData };
      return { ...comments[index] };
    }
    throw new Error("Comment not found");
  },

  async delete(id) {
    await delay(250);
    const index = comments.findIndex(c => c.Id === id);
    if (index !== -1) {
      comments.splice(index, 1);
      return true;
    }
    throw new Error("Comment not found");
  },
};