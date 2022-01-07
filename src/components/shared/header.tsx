import * as React from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { authSelector } from '../../application/selector/authSelector';
import { IndexedObject } from '../../utils/type';

const Header: React.FC<IndexedObject> = () => {
  const { isAuthenticated, account } = useSelector(authSelector.authentication);

  console.log(account);

  return (
    <>
      <Navbar bg="primary" variant="dark">
        <Container>
          <NavLink to="/home" exact className="navbar-brand">
            Home
          </NavLink>
          <Nav className="me-auto">
            {!isAuthenticated && (
              <>
                <NavLink to="/login" exact className="nav-link">
                  Login
                </NavLink>
                <NavLink to="/register" exact className="nav-link">
                  Register
                </NavLink>
              </>
            )}
            {isAuthenticated && (
              <NavLink to="/user" className="nav-link">
                {account ? account.login : null}
              </NavLink>
            )}
          </Nav>
        </Container>
      </Navbar>
    </>
  );
};

export default Header;
