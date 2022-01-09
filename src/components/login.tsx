import * as React from 'react';
import { useEffect, useState, useCallback } from 'react';
import { Button, Col, Container, Form } from 'react-bootstrap';
import { connect } from 'react-redux';
import { NavLink, RouteComponentProps, useHistory } from 'react-router-dom';
import { AppState } from '../reducer';
import { login, reset } from '../reducer/authenReducer';
import { omit } from '../utils/object';
import { IndexedObject } from '../utils/type';

export interface ILoginProps
  extends StateProps,
    DispatchProps,
    RouteComponentProps<IndexedObject> {}

const LoginPage: React.FC<ILoginProps> = (props) => {
  const [state, setState] = useState({
    login: '',
    password: '',
    errors: [] as string[],
  });
  const [validated, setValidated] = useState(false);
  const history = useHistory();

  const { loading, loginSuccess, loginError } = props;

  const changeHandler = useCallback(
    (e: IndexedObject) => {
      setState({ ...state, [e.target.name]: e.target.value });
    },
    [state],
  );

  //handle submit form
  const handleSubmit = useCallback(
    (event: IndexedObject) => {
      event.preventDefault();
      setValidated(true);

      //validate
      const errors: string[] = [];

      //login name
      if (state.login === '') {
        errors.push('login');
      }

      //password
      if (state.password.length <= 0 || state.password.length >= 20) {
        errors.push('password');
      }

      setState({
        ...state,
        errors: errors,
      });

      if (errors.length > 0) {
        return false;
      } else {
        props.login(omit('errors', state));
      }
    },
    [state],
  );

  useEffect(() => {
    props.reset();
    return () => {
      props.reset();
    };
  }, []);

  return (
    <div className="Article">
      <div>
        <Container className="mt-5">
          <h1>Login</h1>
          <Form noValidate validated={validated} onSubmit={handleSubmit} className="mt-5">
            <Form.Group as={Col} md="6" controlId="login">
              <Form.Label>Login Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Login Name"
                required
                onChange={changeHandler}
                value={state.login}
                name="login"
              />
              <Form.Control.Feedback type="invalid">
                Please provide your name.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="6" controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                required
                onChange={changeHandler}
                value={state.password}
                name="password"
              />
              <Form.Control.Feedback type="invalid">
                Please provide your name.
              </Form.Control.Feedback>
            </Form.Group>
            {loginError && <p className="text-danger mb-0">Invalid username or password</p>}
            <Button type="submit" className="mt-3">
              Login
            </Button>
            <div className="mt-4">
              <NavLink to="/register">Register</NavLink>
            </div>
          </Form>
        </Container>
      </div>
    </div>
  );
};

const mapStateToProps = ({ authentication }: AppState) => ({
  loading: authentication.loading,
  loginSuccess: authentication.loginSuccess,
  loginError: authentication.loginError,
  account: authentication.account,
});

const mapDispatchToProps = {
  login,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
