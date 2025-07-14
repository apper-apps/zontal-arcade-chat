import blogData from "@/services/mockData/blogPosts.json";

let blogPosts = [...blogData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const blogService = {
  async getAll() {
    await delay(300);
    return blogPosts.map(post => ({ ...post }));
  },

  async getById(id) {
    await delay(200);
    const post = blogPosts.find(p => p.Id === id);
    return post ? { ...post } : null;
  },

  async create(postData) {
    await delay(400);
    const newPost = {
      ...postData,
      Id: Math.max(...blogPosts.map(p => p.Id)) + 1,
    };
    blogPosts.push(newPost);
    return { ...newPost };
  },

  async update(id, postData) {
    await delay(350);
    const index = blogPosts.findIndex(p => p.Id === id);
    if (index !== -1) {
      blogPosts[index] = { ...blogPosts[index], ...postData };
      return { ...blogPosts[index] };
    }
    throw new Error("Blog post not found");
  },

  async delete(id) {
    await delay(300);
    const index = blogPosts.findIndex(p => p.Id === id);
    if (index !== -1) {
      blogPosts.splice(index, 1);
      return true;
    }
    throw new Error("Blog post not found");
  },
};