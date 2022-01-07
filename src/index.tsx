import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as React from 'react';
import { AxiosProvider } from 'react-axios-helpers';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import setupAxiosInterceptors from './application/config/axios-interceptor';
import Header from './components/shared/header';
import './index.css';
import store from './reducer';
import reportWebVitals from './reportWebVitals';
import RoutedApp from './routes/routes';
import { returnVoidDummyFn } from './type/types';

const customAxiosInstance = axios.create();
setupAxiosInterceptors(() => returnVoidDummyFn);

const rootElement = document.getElementById('root');
ReactDOM.render(
  <Provider store={store}>
    <AxiosProvider instance={customAxiosInstance}>
      <BrowserRouter>
        <Header />
        <RoutedApp />
      </BrowserRouter>
    </AxiosProvider>
  </Provider>,
  rootElement,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
