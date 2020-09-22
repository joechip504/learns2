import { ThunkAction, Action, combineReducers } from '@reduxjs/toolkit';
import { replayReducer } from '../store/replay/reducers';
import { authReducer } from '../store/auth/reducers';

import { connectRouter } from 'connected-react-router'
import { createBrowserHistory } from 'history';
import { applyMiddleware, compose, createStore } from 'redux'
import { routerMiddleware } from 'connected-react-router'

const createRootReducer = (history: any) => combineReducers({
  router: connectRouter(history),
  replay: replayReducer,
  auth: authReducer
});

export const history = createBrowserHistory();

export default function configureStore(preloadedState: any) {
  const store = createStore(
    createRootReducer(history), // root reducer with router state
    preloadedState,
    compose(
      applyMiddleware(
        routerMiddleware(history) // for dispatching history actions
      ),
    ),
  )

  return store
}

export const store = configureStore({
  reducer: createRootReducer(history) 
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
