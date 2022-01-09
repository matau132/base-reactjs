import * as React from 'react';
import { useCallback } from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { AppState } from '../../reducer';
import { logout } from '../../reducer/authenReducer';

export interface IHeaderProps extends StateProps, DispatchProps {}

const Header: React.FC<IHeaderProps> = (props) => {
  const { isAuthenticated, account } = props;

  const handleLogout = useCallback(() => {
    props.logout();
  }, [props]);

  return (
    <>
      <Navbar bg="primary" variant="dark">
        <Container>
          <NavLink to="/home" exact className="navbar-brand">
            Home
          </NavLink>
          <Nav>
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
              <>
                <NavLink to="/user" className="nav-link">
                  {account ? account.login : null}
                </NavLink>
                <button className="btn text-white" onClick={handleLogout}>
                  Logout
                </button>
              </>
            )}
          </Nav>
        </Container>
      </Navbar>
    </>
  );
};

const mapStateToProps = ({ authentication }: AppState) => ({
  isAuthenticated: authentication.isAuthenticated,
  account: authentication.account,
});

const mapDispatchToProps = { logout };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Header);
