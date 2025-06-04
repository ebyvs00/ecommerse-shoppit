const express = require('express');
const cors = require('cors');

const app = express();

// ✅ Allow your frontend to connect
app.use(cors({
  origin: 'https://ecommerse-shoppit-asja.vercel.app' // <-- your Vercel site
}));

// Example API route
app.get('/api/products', (req, res) => {
  res.json([
    { id: 1, name: 'Product A' },
    { id: 2, name: 'Product B' },
  ]);
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
