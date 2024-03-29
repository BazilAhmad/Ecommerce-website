import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import { Container, ListGroup, Row, Col, Button, Card } from 'react-bootstrap';

function SearchResults({ addToCart }) {
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get('query');
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const response = await axios.get(`https://dummyjson.com/products/search?q=${searchTerm}`);
        setProducts(response.data.products);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    };
    if (searchTerm) {
      fetchSearchResults();
    }
  }, [searchTerm]);

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Search Results</h2>
      <ListGroup>
        {products.map((product) => (
          <ListGroup.Item key={product.id} className="mb-3">
            <Row className="align-items-center">
              <Col md={3}>
                <Card.Img variant="top" src={product.thumbnail} style={{ width: '100%', height: 'auto' }} />
              </Col>
              <Col md={6}>
                <h5>{product.title}</h5>
                <p>{product.description}</p>
              </Col>
              <Col md={3} className="text-md-right">
                <p className="text-muted">${product.price}</p>
                <Button variant="primary" onClick={() => addToCart(product)}>Add to Cart</Button>
              </Col>
            </Row>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
}

export default SearchResults;
