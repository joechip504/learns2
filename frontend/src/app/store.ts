import { configureStore, ThunkAction, Action, combineReducers } from '@reduxjs/toolkit';
import { replayReducer } from '../store/replay/reducers';
import { authReducer } from '../store/auth/reducers';


const rootReducer = combineReducers({
  replay: replayReducer,
  auth: authReducer
})

export const store = configureStore({
  reducer: rootReducer 
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
