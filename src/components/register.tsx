import * as React from 'react';
import { useCallback, useState } from 'react';
import { Button, Col, Container, Form } from 'react-bootstrap';
import { connect } from 'react-redux';
import { NavLink, RouteComponentProps, useHistory } from 'react-router-dom';
import { IRegisterModel } from '../models/register_model';
import { AppState } from '../reducer';
import { createEntity, reset } from '../reducer/registerReducer';
import { omit } from '../utils/object';
import { IndexedObject } from '../utils/type';

export interface IRegisterProps
  extends StateProps,
    DispatchProps,
    RouteComponentProps<IndexedObject> {}

const RegisterPage: React.FC<IRegisterProps> = (props) => {
  //state
  const [state, setState] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    errors: [] as string[],
  });
  const [validated, setValidated] = useState(false);

  //get props
  const { updating, updateSuccess, showModel } = props;
  const history = useHistory();

  const hasError = (key: string) => {
    return state.errors.indexOf(key) !== -1;
  };

  const close = useCallback(() => {
    props.reset();
  }, [props]);

  //if register success then redirect to login page
  const handleOk = useCallback(
    (responseRegister) => {
      if (updateSuccess) {
        localStorage.setItem(
          'account',
          JSON.stringify(omit('confirmPassword', responseRegister.action.payload.data)),
        );
        history.push('/login');
      }
      // close();
    },
    [close, updateSuccess],
  );

  const changeHandler = useCallback(
    (event: IndexedObject) => {
      setState((state) => ({ ...state, [event.target.name]: event.target.value }));
    },
    [state],
  );

  //submit register form event
  const handleSubmit = useCallback(
    async (event: IndexedObject) => {
      event.preventDefault();
      setValidated(true);
      //VALIDATE
      const errors: string[] = [];

      //firstname
      if (state.fullName === '') {
        errors.push('fullName');
      }

      //email
      const expression = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
      const validEmail = expression.test(String(state.email).toLowerCase());

      if (!validEmail) {
        errors.push('email');
      }

      //password
      if (state.password.length <= 0 || state.password.length >= 20) {
        errors.push('password');
      }

      //confirm password
      if (state.confirmPassword.length <= 0 || state.confirmPassword.length >= 20) {
        errors.push('confirm password');
      }

      setState({
        ...state,
        errors: errors,
      });

      if (errors.length > 0) {
        return false;
      } else {
        const entity = {
          ...omit('errors', state),
          login: state.email,
        } as IRegisterModel;
        const responseRegister = await props.createEntity(entity);
        handleOk(responseRegister);
      }
    },
    [state],
  );

  return (
    <div className="Article">
      <Container className="mt-5">
        <h1>Register</h1>
        <Form noValidate validated={validated} onSubmit={handleSubmit} className="my-5">
          <Form.Group as={Col} md="6" controlId="fullName">
            <Form.Label>Full Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Full Name"
              required
              onChange={changeHandler}
              value={state.fullName}
              name="fullName"
            />
            <Form.Control.Feedback type="invalid">Please provide your name.</Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} md="6" controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="text"
              placeholder="Email"
              required
              onChange={changeHandler}
              value={state.email}
              name="email"
            />
            <Form.Control.Feedback type="invalid">
              Please provide a valid email.
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
              Please provide a valid password.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} md="6" controlId="confirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm Password"
              required
              onChange={changeHandler}
              value={state.confirmPassword}
              name="confirmPassword"
            />
            <Form.Control.Feedback type="invalid">
              Please provide a valid password.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="my-3">
            <Form.Check
              required
              label="Agree to terms and conditions"
              feedback="You must agree before submitting."
              feedbackType="invalid"
            />
          </Form.Group>
          <Button type="submit">Submit form</Button>
        </Form>
        <NavLink to="/login">Login</NavLink>
      </Container>
    </div>
  );
};

//get register state from redux store
const mapStateToProps = ({ register }: AppState) => ({
  updating: register.updating,
  updateSuccess: register.updateSuccess,
  showModel: register.showModel,
});

const mapDispatchToProps = { createEntity, reset };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(RegisterPage);
