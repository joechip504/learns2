import { AuthActionTypes, AuthState, SET_USER } from "./types";
import { Reducer } from "@reduxjs/toolkit";

const initialState: AuthState = {
    isAuthenticated: false
}

export const authReducer: Reducer<AuthState, AuthActionTypes> = (state: AuthState = initialState, action: AuthActionTypes): AuthState => {
    switch (action.type) {
        case SET_USER:
            return { ...state, isAuthenticated: action.isAuthenticated, email: action.email}
        default:
            return state;
    }
}