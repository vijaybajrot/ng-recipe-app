import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, of } from 'rxjs';
import { map, mergeMap, catchError, switchMap } from 'rxjs/operators';
import { User } from '../user.model';

import * as authActions from './auth.actions';

export interface AuthResponse {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

const KEY = 'AIzaSyCNXO1DBNHiIbzNgC6fpiFLhOf5NwmESwc';

const handleError = (errorResponse: HttpErrorResponse) => {
  let message = 'Unknown error';
  const { error } = errorResponse.error;
  if (!error || !error.message) {
    return of(new authActions.LoginFail('Login Failed'));
  }

  message = error.message;
  return of(new authActions.LoginFail(message));
};

const handleAuth = (response: AuthResponse) => {
  const expiredAt = new Date(
    new Date().getTime() + parseInt(response.expiresIn) * 1000
  );
  const user = new User(
    response.email,
    response.localId,
    response.idToken,
    expiredAt
  );
  // this.user.next(user);

  return new authActions.Login({
    id: response.localId,
    email: response.email,
    token: response.idToken,
    tokenExpireDate: expiredAt,
  });
  //localStorage.setItem('user.snapshot', JSON.stringify(user));
};

@Injectable()
export class AuthEffects {
  authLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.AuthActionTypes.LOGIN_START),
      switchMap((data: authActions.LoginStart) => {
        return this.http
          .post<AuthResponse>(
            `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${KEY}`,
            {
              email: data.payload.email,
              password: data.payload.password,
              returnSecureToken: true,
            }
          )
          .pipe(
            map((response) => {
              return handleAuth(response)
            }),
            catchError((errorResponse) => {
              return handleError(errorResponse);
            })
          );
      })
    )
  );

  constructor(private actions$: Actions, private http: HttpClient) {}
}
