import * as React from 'react';
import { NavLink } from 'react-router-dom';
import { IndexedObject } from '../utils/type';

const LoginPage: React.FC<IndexedObject> = () => {
  return (
    <div className="Article">
      <div>
        <NavLink to="/register">Register</NavLink>
      </div>
    </div>
  );
};

export default LoginPage;
