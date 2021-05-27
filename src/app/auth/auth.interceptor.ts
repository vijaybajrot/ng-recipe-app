import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpParams,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { exhaustMap, take } from 'rxjs/operators';
import { AppState } from '../store/root.reducer';
import { Store } from '@ngrx/store';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private store: Store<AppState>
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return this.store
      .select((store) => store.auth.user)
      .pipe(
        take(1),
        exhaustMap((user) => {
          if (!user) {
            return next.handle(request);
          }

          const token = user ? user.token || '' : '';
          const cloneRequest = request.clone({
            params: new HttpParams().set('auth', token),
          });

          return next.handle(cloneRequest);
        })
      );
  }
}