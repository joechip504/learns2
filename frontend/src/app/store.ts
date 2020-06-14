import { configureStore, ThunkAction, Action, combineReducers } from '@reduxjs/toolkit';
import { replayReducer } from '../store/replay/reducers';


const rootReducer = combineReducers({
  replay: replayReducer
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
