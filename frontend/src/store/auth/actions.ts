import { AuthActionTypes, SET_USER} from './types'

export const setUser = (user: firebase.User): AuthActionTypes => {
    return {
        type: SET_USER,
        isAuthenticated: true,
        email: user.email!
    }
}