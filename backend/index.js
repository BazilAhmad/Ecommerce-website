require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());

// Import the reviews route
const reviewsRoutes = require('./routes/reviewsRoutes'); // Adjust the path as necessary

app.use(express.json());

// Use the reviews route for any requests that start with '/api/reviews'
app.use('/api/reviews', reviewsRoutes);


// Use the PORT environment variable
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
