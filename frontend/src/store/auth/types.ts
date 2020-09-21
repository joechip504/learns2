export interface AuthState {
    isAuthenticated: boolean;
    email?: string;
}

interface SetUserAction {
    type: typeof SET_USER;
    isAuthenticated: boolean;
    email: string;
}

export const SET_USER = 'SET_USER';

export type AuthActionTypes = SetUserAction;
