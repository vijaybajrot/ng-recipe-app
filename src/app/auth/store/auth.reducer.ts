import { User } from '../user.model';
import { AuthActionTypes, AuthActions } from './auth.actions';

export type State = { user: User };

const initialState: State = {
  user: null,
};

export function authReducer(state = initialState, action: AuthActions) {
  switch (action.type) {
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
