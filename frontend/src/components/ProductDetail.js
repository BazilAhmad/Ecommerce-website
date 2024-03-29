import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Card, Button, Container, Row, Col } from 'react-bootstrap';

function ProductDetail({ addToCart }) {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    author: "",
    rating: 5,
    comment: ""
  });


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReview(prev => ({
      ...prev,
      [name]: value
    }));
  };

  useEffect(() => {
    const fetchProductAndReviews = async () => {
      const productResponse = await axios.get(`https://dummyjson.com/products/${productId}`);
      setProduct(productResponse.data);
      const reviewsResponse = await axios.get(`http://localhost:3000/api/reviews/${productId}`);
      setReviews(reviewsResponse.data);
    };
  
    fetchProductAndReviews();
  }, [productId]);

  const submitReview = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:3000/api/reviews/${productId}`, newReview);
      // Fetch and update reviews after adding new one
      const { data } = await axios.get(`http://localhost:3000/api/reviews/${productId}`);
      setReviews(data);
      // Reset form
      setNewReview({ author: "", rating: 5, comment: "" });
    } catch (error) {
      console.error('Error adding review:', error);
    }
  };

  const calculateAverageRating = (reviews) => {
    if (reviews.length === 0) return "No reviews yet";
    const total = reviews.reduce((acc, review) => acc + review.rating, 0);
    const averageRating = total / reviews.length;
    return "★".repeat(Math.round(averageRating)) + "☆".repeat(5 - Math.round(averageRating));
  };
  const averageRating = calculateAverageRating(reviews);


  
  
  // Delete a review
  const deleteReview = async (reviewId) => {
    try {
      await axios.delete(`http://localhost:3000/api/reviews/${reviewId}`);
      // Fetch and update reviews after deletion
      const { data } = await axios.get(`http://localhost:3000/api/reviews/${productId}`);
      setReviews(data);
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  if (!product) return <div>Loading...</div>;

  return (
    <Container className="mt-5">
      <Row>
        <Col md={6} className="d-flex justify-content-center mb-3">
          <Card style={{ width: '18rem' }}>
            <Card.Img variant="top" src={product?.thumbnail} />
          </Card>
        </Col>
        <Col md={6}>
          <h2>{product?.title}</h2>
          <p>{product?.description}</p>
          <h4>${product?.price}</h4>
          {/* Display average rating here */}
          <div style={{ marginBottom: '1rem' }}>
            <strong>Average Rating:</strong> {averageRating !== "No reviews yet" ? averageRating + " / 5" : "No reviews yet"}
          </div>
          <Button variant="primary" onClick={() => addToCart(product)}>
            Add to Cart
          </Button>
        </Col>
      </Row>
  
      {/* Reviews Section */}
      <div className="reviews-section mt-4">
        <h3>Reviews</h3>
        {reviews.length > 0 ? (
          reviews.map(review => (
            <div key={review.id} className="review mb-3">
              <strong>{review.author}</strong>: {review.comment} <em>(Rating: {review.rating} / 5)</em>
              <Button variant="danger" size="sm" onClick={() => deleteReview(review.id)} style={{ marginLeft: '10px' }}>Delete Review</Button>
            </div>
          ))
        ) : (
          <p>No reviews yet. Be the first to review!</p>
        )}
      </div>
  
      {/* Add Review Form */}
      <div className="add-review-form">
        <h3>Add a Review</h3>
        <form onSubmit={submitReview}>
          <div className="form-group">
            <label htmlFor="author">Author</label>
            <input
              type="text"
              className="form-control"
              id="author"
              name="author"
              value={newReview.author}
              onChange={handleInputChange}
              placeholder="Author Name"
            />
          </div>
          <div className="form-group">
            <label htmlFor="rating">Rating</label>
            <input
              type="number"
              className="form-control"
              id="rating"
              name="rating"
              value={newReview.rating}
              min="1"
              max="5"
              onChange={handleInputChange}
              placeholder="Rating (1-5)"
            />
          </div>
          <div className="form-group">
            <label htmlFor="comment">Comment</label>
            <textarea
              className="form-control"
              id="comment"
              name="comment"
              value={newReview.comment}
              onChange={handleInputChange}
              placeholder="Your review"
            />
          </div>
          <Button variant="success" type="submit">Submit Review</Button>
        </form>
      </div>
    </Container>
  );
        }  

export default ProductDetail;
