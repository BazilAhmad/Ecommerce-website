import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar, Container, Nav, Form, FormControl, Button, Badge } from 'react-bootstrap';

function Header({ cartItemCount }) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
    setSearchTerm('');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="py-3">
      <Container fluid>
        <Navbar.Brand onClick={() => navigate('/')} style={{cursor: 'pointer'}}>
          E-Commerce Site
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Form className="d-flex flex-grow-1 mx-5" onSubmit={handleSearch}>
            <FormControl
              type="search"
              placeholder="Search for products..."
              className="me-2"
              aria-label="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button variant="outline-success" type="submit">Search</Button>
          </Form>
          <Nav className="ms-auto">
            <Button variant="outline-info" onClick={() => navigate('/cart')}>
              <i className="fas fa-shopping-cart"></i>
              <span> Cart </span>
              {cartItemCount > 0 && (
                <Badge pill bg="success">
                  {cartItemCount}
                </Badge>
              )}
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
