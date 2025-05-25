app.get('/', (req, res) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Post Manager</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        * { box-sizing: border-box; }
        body {
          font-family: 'Segoe UI', sans-serif;
          background-color: #f0f2f5;
          margin: 0;
          padding: 0;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          min-height: 100vh;
          padding-top: 40px;
        }
        .card {
          background: #fff;
          padding: 30px;
          border-radius: 10px;
          width: 100%;
          max-width: 500px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        h1 {
          text-align: center;
          color: #333;
          margin-bottom: 30px;
        }
        form {
          margin-bottom: 20px;
        }
        input, button, textarea {
          width: 100%;
          padding: 10px;
          margin-top: 10px;
          border: 1px solid #ccc;
          border-radius: 6px;
          font-size: 16px;
        }
        button {
          background-color: #007bff;
          color: white;
          border: none;
          cursor: pointer;
          transition: background 0.3s;
        }
        button:hover {
          background-color: #0056b3;
        }
        .form-group {
          margin-bottom: 20px;
        }
        .link-button {
          background-color: #28a745;
          text-align: center;
          text-decoration: none;
          display: inline-block;
          padding: 10px;
          color: white;
          margin-top: 10px;
          border-radius: 6px;
        }
        .link-button:hover {
          background-color: #218838;
        }
        .section {
          margin-bottom: 30px;
          border-top: 1px solid #eee;
          padding-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="card">
        <h1>📝 Post Manager</h1>

        <div class="section">
          <form action="/post" method="GET">
            <div class="form-group">
              <label>🔍 Get Post by ID</label>
              <input type="number" name="id" placeholder="Enter Post ID" required />
            </div>
            <button type="submit">View Post</button>
          </form>

          <form action="/search-posts" method="GET">
            <div class="form-group">
              <label>🔎 Search by Title</label>
              <input type="text" name="title" placeholder="Search Title..." required />
            </div>
            <button type="submit">Search</button>
          </form>

          <form action="/delete-post" method="POST">
            <div class="form-group">
              <label>🗑️ Delete Post by ID</label>
              <input type="number" name="id" placeholder="Post ID to Delete" required />
            </div>
            <button type="submit">Delete</button>
          </form>
        </div>

        <div class="section">
          <form action="/all-posts" method="GET">
            <div class="form-group">
              <label>📚 View All Posts (with Pagination)</label>
              <input type="number" name="page" placeholder="Page Number" min="1" />
            </div>
            <button type="submit">View All</button>
          </form>
        </div>

        <div class="section">
          <form action="/update-form" method="GET">
            <button type="submit">✏️ Update Post</button>
          </form>
          <form action="/create-form" method="GET">
            <button type="submit">➕ Create New Post</button>
          </form>
        </div>
      </div>
    </body>
    </html>
  `;
  res.send(html);
});

