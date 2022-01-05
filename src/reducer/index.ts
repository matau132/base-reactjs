import { applyMiddleware, combineReducers, compose, createStore, Middleware, Store } from 'redux';
import thunkMiddleware from 'redux-thunk';
import promiseMiddleware from 'redux-promise-middleware';
import errorMiddleware from '../application/config/error-middleware';
import loggerMiddleware from '../application/config/logger-middleware';
import authenReducer, { AuthenticationState } from './authenReducer';
import fliRegisterReducer, { RegisterState } from './registerReducer';
import langReducer, { LangState } from './languageReducer';

export type AppState = {
  authentication: AuthenticationState;
  register: RegisterState;
  language: LangState;
};

const defaultMiddlewares = [thunkMiddleware, errorMiddleware, promiseMiddleware, loggerMiddleware];
const composedMiddlewares = (middlewares: Middleware[]) =>
  compose(applyMiddleware(...defaultMiddlewares, ...middlewares));

const rootReducer = combineReducers<AppState>({
  authentication: authenReducer,
  register: fliRegisterReducer,
  language: langReducer,
});

//load redux state in local storage if available
const loadState = () => {
  try {
    const serializedState = localStorage.getItem('state');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (e) {
    return undefined;
  }
};

//save redux state in local storage
const saveState = (state: AppState) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('state', serializedState);
  } catch (e) {
    // Ignore write errors;
  }
};

//get redux state in local storage, return undefined if unavailable
const peristedState = loadState();

const initialize = (initialState?: AppState, middlewares = []): Store =>
  createStore(rootReducer, initialState, composedMiddlewares(middlewares));

const store = initialize(peristedState);

//save redux state to local storage each time store update
store.subscribe(() => {
  saveState(store.getState());
});

export default store;
