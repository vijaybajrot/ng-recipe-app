import { Action } from '@ngrx/store';

export enum AuthActionTypes {
  LOGIN = '[Auth]/Login',
  LOGOUT = '[Auth]/Logout',
}

export type AuthActions = Login | Logout;

type LoginPayload = {
  id: string;
  email: string;
  token: string;
  tokenExpireDate: Date;
};

export class Login implements Action {
  readonly type = AuthActionTypes.LOGIN;
  constructor(public payload: LoginPayload) {}
}

export class Logout implements Action {
  readonly type = AuthActionTypes.LOGOUT;
}
