import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button, ListGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';



// Assuming this is the function to fetch average rating
const fetchAverageRating = async (productId) => {
  try {
    const reviewsResponse = await axios.get(`http://localhost:3000/api/reviews/${productId}`);
    const reviews = reviewsResponse.data;
    if(reviews.length === 0) return "No reviews";
    const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
    return averageRating.toFixed(1); // Returns the average rating to 1 decimal place
  } catch (error) {
    console.error("Error fetching reviews for product:", productId, error);
    return "No reviews"; // Return "No reviews" in case of error
  }
};

function ProductList({ addToCart }) {
  const [products, setProducts] = useState([]);
  const [ratings, setRatings] = useState({}); // Object to store ratings keyed by product ID

  useEffect(() => {
    const fetchProductsAndRatings = async () => {
      try {
        const response = await axios.get('https://dummyjson.com/products');
        const fetchedProducts = response.data.products;
        setProducts(fetchedProducts);

        // Iterate over fetchedProducts to get ratings
        const ratingPromises = fetchedProducts.map(async (product) => {
          const rating = await fetchAverageRating(product.id);
          return { id: product.id, rating };
        });

        // Wait for all ratings to be fetched
        const ratingsResults = await Promise.all(ratingPromises);
        // Update state with fetched ratings
        setRatings(ratingsResults.reduce((acc, {id, rating}) => ({...acc, [id]: rating}), {}));
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProductsAndRatings();
  }, []);

  const ratingToStars = (rating) => {
    if (rating === "No reviews") return rating; // Return text directly if there are no reviews
    const fullStars = Math.round(rating);
    const starsRepresentation = '★'.repeat(fullStars) + '☆'.repeat(5 - fullStars); // Assumes a 5-star system
    return `${rating} (${starsRepresentation})`; // Combines numeric rating with stars
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Our Products</h2>
      <ListGroup>
        {products.map((product) => (
          <ListGroup.Item key={product.id} className="mb-3">
            <Row className="align-items-center">
              <Col md={3}>
                <Link to={`/products/${product.id}`}>
                  <img src={product.thumbnail} alt={product.title} style={{ width: '100%', height: 'auto', cursor: 'pointer' }} />
                </Link>
              </Col>
              <Col md={6}>
                <Link to={`/products/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <h5>{product.title}</h5>
                  <p>{product.description}</p>
                  {/* Display average rating with stars */}
                  <p>Average Rating: {ratings[product.id] ? ratingToStars(ratings[product.id]) : "No reviews"}</p>
                </Link>
              </Col>
              <Col md={3} className="text-md-right">
                <p className="text-muted">${product.price}</p>
                <Button variant="primary" onClick={(e) => {e.stopPropagation(); addToCart(product);}}>
                  Add to Cart
                </Button>
              </Col>
            </Row>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
}

export default ProductList;
