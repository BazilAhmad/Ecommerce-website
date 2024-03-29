import React from 'react';
import { Container, ListGroup, ListGroupItem, Button, FormControl, Row, Col, Badge } from 'react-bootstrap';

function Cart({ cartItems, removeFromCart, updateQuantity, checkout, totalPrice }) {
  return (
    <Container className="mt-4">
      <h2 className="mb-4">Cart Items</h2>
      <ListGroup variant="flush">
        {cartItems.length > 0 ? cartItems.map(item => (
          <ListGroupItem key={item.id} className="d-flex justify-content-between align-items-center">
            <div className="me-auto">
              <Badge bg="info" className="me-3">{item.quantity}x</Badge>
              {item.title}
            </div>
            <FormControl 
              type="number" 
              value={item.quantity} 
              onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
              style={{ width: '80px', marginRight: '10px' }}
            />
            <span className="me-2">${(item.quantity * item.price).toFixed(2)}</span>
            <Button variant="outline-danger" size="sm" onClick={() => removeFromCart(item.id)}>
              <i className="fas fa-trash"></i>
            </Button>
          </ListGroupItem>
        )) : <ListGroupItem>Your cart is empty.</ListGroupItem>}
      </ListGroup>
      <Row className="justify-content-end mt-3">
        <Col md={4}>
          <ListGroup>
            <ListGroupItem className="d-flex justify-content-between align-items-center">
              <strong>Total Price:</strong>
              <span>${totalPrice.toFixed(2)}</span>
            </ListGroupItem>
          </ListGroup>
          <Button onClick={checkout} variant="success" className="mt-3 w-100">Checkout</Button>
        </Col>
      </Row>
    </Container>
  );
}

export default Cart;
