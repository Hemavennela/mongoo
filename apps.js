const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// MongoDB Schema
const postSchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  userId: Number,
  title: String,
  body: String
});
const Post = mongoose.model('Post', postSchema);

// Seeding
async function seedPosts() {
  const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
  const posts = response.data.map(p => ({
    id: p.id,
    userId: p.userId,
    title: p.title,
    body: p.body
  }));

  await Post.deleteMany({});
  await Post.insertMany(posts);
  console.log('✅ Seeded');
}

// Connect MongoDB
mongoose.connect('mongodb://localhost:27017/postmanager', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  console.log('✅ Connected to MongoDB');
  if ((await Post.countDocuments()) === 0) {
    await seedPosts();
  }
}).catch(err => console.error(err));

// ✅ Frontend Route (New Design)
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Post Manager</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f0f0f5;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 50px 20px;
        }

        h1 {
          color: #333;
        }

        .button-group {
          display: flex;
          flex-wrap: wrap;
          gap: 15px;
          justify-content: center;
          margin-top: 30px;
        }

        form {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        input {
          padding: 8px 12px;
          border-radius: 999px;
          border: 1px solid #ccc;
        }

        button {
          background-color: lavender;
          border: none;
          border-radius: 999px;
          padding: 10px 20px;
          cursor: pointer;
          font-size: 14px;
          transition: background 0.3s ease;
        }

        button:hover {
          background-color: #d8bfe8;
        }
      </style>
    </head>
    <body>
      <h1>Post Manager</h1>
      <div class="button-group">
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
          <input type="number" name="page" placeholder="Page #" />
          <button type="submit">Paginate</button>
        </form>
      </div>
    </body>
    </html>
  `);
});

// ✅ Your backend routes (unchanged)
app.get('/post', async (req, res) => {
  const post = await Post.findOne({ id: parseInt(req.query.id) });
  if (!post) return res.send(`<h2>No post found with ID ${req.query.id}</h2><a href="/">Back</a>`);
  res.send(`
    <html><body style="font-family:Arial; text-align:center;">
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

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
