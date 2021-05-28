import { User } from '../user.model';
import { AuthActionTypes, AuthActions } from './auth.actions';

export type State = { user: User; authError: string; loading: boolean };

const initialState: State = {
  user: null,
  authError: null,
  loading: false,
};

export function authReducer(state: State = initialState, action: AuthActions) {
  switch (action.type) {
    case AuthActionTypes.LOGIN_START:
      return {
        ...state,
        loading: true,
      };
    case AuthActionTypes.LOGIN:
      const user = new User(
        action.payload.email,
        action.payload.id,
        action.payload.token,
        action.payload.tokenExpireDate
      );
      return {
        ...state,
        user,
        loading: false,
      };
    case AuthActionTypes.LOGIN_FAIL:
      return {
        ...state,
        loading: false,
        authError: action.payload
      };
    case AuthActionTypes.LOGOUT:
      return {
        ...state,
        user: null,
      };
    default:
      return state;
  }
}
