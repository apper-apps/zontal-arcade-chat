// Mock comment data
const commentData = [
  {
    id: 1,
    gameId: 1,
    userId: 101,
    username: "GameMaster2024",
    avatar: "/images/avatars/user1.jpg",
    content: "Amazing game! The graphics are stunning and the gameplay is addictive.",
    rating: 5,
    timestamp: "2024-03-15T10:30:00Z",
    likes: 42,
    dislikes: 2,
    replies: [
      {
        id: 101,
        userId: 102,
        username: "SpaceExplorer",
        avatar: "/images/avatars/user2.jpg",
        content: "I totally agree! Best space game I've played.",
        timestamp: "2024-03-15T11:45:00Z",
        likes: 12,
        dislikes: 0
      }
    ]
  },
  {
    id: 2,
    gameId: 1,
    userId: 103,
    username: "RetroGamer",
    avatar: "/images/avatars/user3.jpg",
    content: "Good game but could use more levels. Still entertaining though!",
    rating: 4,
    timestamp: "2024-03-14T15:20:00Z",
    likes: 28,
    dislikes: 5,
    replies: []
  },
  {
    id: 3,
    gameId: 2,
    userId: 104,
    username: "PuzzleQueen",
    avatar: "/images/avatars/user4.jpg",
    content: "Perfect brain teaser! The difficulty curve is just right.",
    rating: 5,
    timestamp: "2024-03-13T09:15:00Z",
    likes: 35,
    dislikes: 1,
    replies: [
      {
        id: 102,
        userId: 105,
        username: "BrainChallenger",
        avatar: "/images/avatars/user5.jpg",
        content: "Which level are you on? I'm stuck on level 15!",
        timestamp: "2024-03-13T12:30:00Z",
        likes: 8,
        dislikes: 0
      }
    ]
  },
  {
    id: 4,
    gameId: 3,
    userId: 106,
    username: "SpeedDemon",
    avatar: "/images/avatars/user6.jpg",
    content: "Fast cars, great tracks! This is my new favorite racing game.",
    rating: 5,
    timestamp: "2024-03-12T18:45:00Z",
    likes: 56,
    dislikes: 3,
    replies: []
  },
  {
    id: 5,
    gameId: 4,
    userId: 107,
    username: "FantasyFan",
    avatar: "/images/avatars/user7.jpg",
    content: "The storyline is incredible! Can't wait for the next update.",
    rating: 5,
    timestamp: "2024-03-11T14:20:00Z",
    likes: 73,
    dislikes: 2,
    replies: [
      {
        id: 103,
        userId: 108,
        username: "QuestMaster",
        avatar: "/images/avatars/user8.jpg",
        content: "Have you completed the dragon quest yet?",
        timestamp: "2024-03-11T16:10:00Z",
        likes: 15,
        dislikes: 1
      },
      {
        id: 104,
        userId: 107,
        username: "FantasyFan",
        avatar: "/images/avatars/user7.jpg",
        content: "@QuestMaster Yes! That boss fight was epic!",
        timestamp: "2024-03-11T17:30:00Z",
        likes: 20,
        dislikes: 0
      }
    ]
  },
  {
    id: 6,
    gameId: 5,
    userId: 109,
    username: "ArcadeNostalgia",
    avatar: "/images/avatars/user9.jpg",
    content: "Takes me back to the good old arcade days. Simple but fun!",
    rating: 4,
    timestamp: "2024-03-10T11:00:00Z",
    likes: 31,
    dislikes: 4,
    replies: []
  }
];

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