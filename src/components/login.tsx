import * as React from 'react';
import { useState, useCallback } from 'react';
import { Button, Col, Container, Form } from 'react-bootstrap';
import { connect } from 'react-redux';
import { NavLink, RouteComponentProps, useHistory } from 'react-router-dom';
import { AppState } from '../reducer';
import { IndexedObject } from '../utils/type';
import { login } from '../reducer/authenReducer';
import { omit } from '../utils/object';

export interface ILoginProps
  extends StateProps,
    DispatchProps,
    RouteComponentProps<IndexedObject> {}

const LoginPage: React.FC<ILoginProps> = (props) => {
  const [validated, setValidated] = useState(false);
  const [state, setState] = useState({
    login: '',
    password: '',
    errors: [] as string[],
  });
  const history = useHistory();

  const { loading, loginSuccess, account } = props;

  const changeHandler = (e: IndexedObject) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const handleOk = useCallback(() => {
    if (loginSuccess) {
      history.push('/home');
    }
  }, [loginSuccess]);

  //handle submit form
  const handleSubmit = async (event: IndexedObject) => {
    event.preventDefault();
    event.stopPropagation();
    setValidated(true);

    await props.login(omit('errors', state));
    handleOk();
  };

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
            <Button type="submit" className="mt-5">
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
  account: authentication.account,
});

const mapDispatchToProps = {
  login,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
