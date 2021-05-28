import { Action } from '@ngrx/store';

export enum AuthActionTypes {
  LOGIN = '[Auth]/Login',
  LOGIN_START = '[Auth]/Login_Start',
  LOGIN_FAIL = '[Auth]/Login_Fail',
  LOGOUT = '[Auth]/Logout',
}

export type AuthActions = Login | LoginStart | LoginFail | Logout;

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

export class LoginStart implements Action {
  readonly type = AuthActionTypes.LOGIN_START;

  constructor(public payload: {email: string, password: string}) {}
}

export class LoginFail implements Action {
  readonly type = AuthActionTypes.LOGIN_FAIL;

  constructor(public payload: string) {}
}

export class Logout implements Action {
  readonly type = AuthActionTypes.LOGOUT;
}
