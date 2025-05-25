const express = require('express');
const axios = require('axios');
const mongoose = require('mongoose');
const app = express();
const PORT = 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// MongoDB schema
const postSchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  userId: Number,
  title: String,
  body: String
});
const Post = mongoose.model('Post', postSchema);

// Seed posts
async function seedPosts() {
  try {
    const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
    const posts = response.data.map(p => ({
      id: p.id,
      userId: p.userId,
      title: p.title,
      body: p.body
    }));

    await Post.deleteMany({});
    await Post.insertMany(posts);
    console.log('✅ Seeding completed');
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
  }
}

// Connect to MongoDB
const MONGO_URI = 'mongodb://localhost:27017/postmanager';
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  console.log('✅ Connected to MongoDB');
  const count = await Post.countDocuments();
  if (count === 0) {
    console.log('🌱 Seeding posts...');
    await seedPosts();
  }
}).catch(err => {
  console.error('❌ MongoDB error:', err);
});

// ---------- New Frontend Design ----------
app.get('/', (req, res) => {
  res.send(`
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Post Manager</title>
    <style>
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background-color: #f9f9fb;
        margin: 0;
        padding: 40px 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      h1 {
        margin-bottom: 30px;
        color: #444;
      }
      .button-container {
        display: flex;
        flex-wrap: wrap;
        gap: 15px;
        justify-content: center;
        max-width: 1000px;
      }
      form {
        display: flex;
        flex-wrap: nowrap;
        align-items: center;
        gap: 8px;
      }
      input[type="number"],
      input[type="text"] {
        padding: 8px 12px;
        border-radius: 20px;
        border: 1px solid #ccc;
        font-size: 14px;
      }
      button {
        background-color: lavender;
        color: #333;
        border: none;
        padding: 10px 20px;
        border-radius: 20px;
        font-size: 14px;
        cursor: pointer;
        transition: background-color 0.3s ease;
      }
      button:hover {
        background-color: #e0d4f7;
      }
    </style>
  </head>
  <body>
    <h1>Post Manager</h1>
    <div class="button-container">
      <form action="/post" method="GET">
        <input type="number" name="id" placeholder="Post ID" required />
        <button type="submit">Get Post</button>
      </form>
      <form action="/all-posts" method="GET">
        <button type="submit">Get All Posts</button>
      </form>
      <form action="/update-form" method="GET">
        <input type="number" name="id" placeholder="Update ID" required />
        <button type="submit">Update</button>
      </form>
      <form action="/create-form" method="GET">
        <button type="submit">Create</button>
      </form>
      <form action="/search-posts" method="GET">
        <input type="text" name="title" placeholder="Search Title" required />
        <button type="submit">Search</button>
      </form>
      <form action="/delete-post" method="POST">
        <input type="number" name="id" placeholder="Delete ID" required />
        <button type="submit">Delete</button>
      </form>
      <form action="/all-posts" method="GET">
        <input type="number" name="page" placeholder="Page #" min="1" />
        <button type="submit">Paginate</button>
      </form>
    </div>
  </body>
  </html>
  `);
});

// ---------- Routes ----------
app.get('/post', async (req, res) => {
  const post = await Post.findOne({ id: parseInt(req.query.id) });
  if (!post) return res.send(`<h2>No post found with ID ${req.query.id}</h2><a href="/">Back</a>`);
  res.send(`
    <html><body style="font-family:Arial; text-align:center; background:#f4f4f4; padding:50px;">
      <h2>Post ID ${post.id}</h2>
      <table border="1" cellpadding="10" align="center">
        <tr><th>ID</th><td>${post.id}</td></tr>
        <tr><th>Title</th><td>${post.title}</td></tr>
        <tr><th>Body</th><td>${post.body}</td></tr>
      </table>
      <a href="/">Back</a>
    </body></html>
  `);
});

// ---------- Partial Search Route ----------
app.get('/search-posts', async (req, res) => {
  const { title } = req.query;
  const results = await Post.find({ title: { $regex: title, $options: 'i' } });

  if (!results.length) {
    return res.send(`<h2>No posts found matching "${title}"</h2><a href="/">Back</a>`);
  }

  const rows = results.map(post => `
    <tr>
      <td>${post.id}</td>
      <td>${post.title}</td>
      <td>${post.body}</td>
    </tr>
  `).join('');

  res.send(`
    <html><body style="font-family:Arial; background:#f4f4f4; padding:20px;">
      <h2>Search Results for "${title}"</h2>
      <table border="1" cellpadding="10" style="margin:auto; background:white;">
        <tr><th>ID</th><th>Title</th><th>Body</th></tr>
        ${rows}
      </table>
      <p style="text-align:center;"><a href="/">Back</a></p>
    </body></html>
  `);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
