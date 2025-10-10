import type { ThunkDispatch } from '@reduxjs/toolkit';
import type { RootState } from './store';

// Define reusable types for thunks
export interface ThunkConfig {
  dispatch: ThunkDispatch<any, any, any>;
  state: RootState;
  rejectValue: string | any;
  extra?: any;
}

// Helper type for async thunks
export type AsyncThunkConfig = {
  state: RootState;
  dispatch: ThunkDispatch<RootState, unknown, any>;
  rejectValue: string | Record<string, any>;
};