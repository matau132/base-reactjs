import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import { authSelector } from '../application/selector/authSelector';

interface Props extends RouteProps {
  component: any;
}

//only allow if auth else redirect to login
const PrivateRoute: FC<Props> = ({ component: Component, ...rest }) => {
  const { isAuthenticated } = useSelector(authSelector.authentication);
  console.log('PRIVATE ROUTE ' + isAuthenticated);
  return (
    <Route
      {...rest}
      render={(props) => (isAuthenticated ? <Component {...props} /> : <Redirect to="/login" />)}
    />
  );
};

export default PrivateRoute;
