import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { Button, Col, Container, Form } from 'react-bootstrap';
import { connect } from 'react-redux';
import { NavLink, RouteComponentProps, useHistory } from 'react-router-dom';
import { IUpdateModel } from '../models/update_model';
import { AppState } from '../reducer';
import { reset, updateEntity } from '../reducer/updateReducer';
import { login } from '../reducer/authenReducer';
import { omit } from '../utils/object';
import { IndexedObject } from '../utils/type';

export interface IUpdateProps
  extends StateProps,
    DispatchProps,
    RouteComponentProps<IndexedObject> {}

const UpdatePage: React.FC<IUpdateProps> = (props) => {
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
  const { updating, updateSuccess, showModel, entity } = props;
  const history = useHistory();

  const hasError = (key: string) => {
    return state.errors.indexOf(key) !== -1;
  };

  const close = useCallback(() => {
    props.reset();
  }, [props]);

  //if update success then redirect to home page
  const handleOk = useCallback(async () => {
    if (updateSuccess) {
      close();
      localStorage.setItem('account', JSON.stringify(entity));
      await props.login({
        login: entity.email,
        password: entity.password,
      });
      history.push('/home');
    }
  }, [updateSuccess]);

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
          ...omit('errors', omit('confirmPassword', state)),
          login: state.email,
        } as IUpdateModel;
        props.updateEntity(entity);
      }
    },
    [state, props],
  );

  useEffect(() => {
    const localAccount = localStorage.getItem('account');
    if (localAccount) {
      const account = JSON.parse(localAccount);
      setState((state) => ({
        ...state,
        fullName: account.fullName,
        email: account.email,
        password: account.password,
        confirmPassword: account.password,
      }));
    }
  }, []);

  useEffect(() => {
    handleOk();
  }, [updateSuccess]);

  return (
    <div className="Article">
      <Container className="mt-5">
        <h1>Update User</h1>
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
          <Button type="submit" className="mt-4">
            Change
          </Button>
        </Form>
        <NavLink to="/login">Back</NavLink>
      </Container>
    </div>
  );
};

//get update state from redux store
const mapStateToProps = ({ update }: AppState) => ({
  updating: update.updating,
  updateSuccess: update.updateSuccess,
  showModel: update.showModel,
  entity: update.entity,
});

const mapDispatchToProps = { updateEntity, reset, login };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(UpdatePage);
