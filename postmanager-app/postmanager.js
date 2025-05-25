const Post = require('./models/Post');

class PostManager {
  async createPost(title, content) {
    const post = new Post({ title, content });
    return await post.save();
  }

  async getPostById(id) {
    return await Post.findById(id);
  }

  async getAllPosts() {
    return await Post.find();
  }

  async updatePost(id, data) {
    return await Post.findByIdAndUpdate(id, data, { new: true });
  }

  async deletePost(id) {
    return await Post.findByIdAndDelete(id);
  }
}

module.exports = PostManager;
