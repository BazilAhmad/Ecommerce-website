const express = require('express');
const { Pool } = require('pg');
require('dotenv').config();

const router = express.Router();



// Create a new PostgreSQL pool
const pool = new Pool();

// GET reviews for a specific product
router.get('/:productId', async (req, res) => {
    const { productId } = req.params;
    try {
        const { rows } = await pool.query('SELECT * FROM reviews WHERE productId = $1', [productId]);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

router.post('/:productId', async (req, res) => {
    const { productId } = req.params;
    const { author, rating, comment } = req.body; // Assuming these are the fields for your review

    try {
        const query = 'INSERT INTO reviews (productId, author, rating, comment) VALUES ($1, $2, $3, $4) RETURNING *';
        const values = [productId, author, rating, comment];
        const { rows } = await pool.query(query, values);
        
        res.status(201).json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// DELETE review by id
router.delete('/:reviewId', async (req, res) => {
    const { reviewId } = req.params;
    try {
        const deleteQuery = 'DELETE FROM reviews WHERE id = $1 RETURNING *';
        const { rows } = await pool.query(deleteQuery, [reviewId]);
        
        if (rows.length === 0) {
            return res.status(404).send('Review not found');
        }
        
        res.send(`Review with ID ${reviewId} deleted`);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});


module.exports = router;
