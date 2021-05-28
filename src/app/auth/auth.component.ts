import { AuthService, AuthResponse } from './auth.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../store/root.reducer';

import * as authActions from './store/auth.actions';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit, OnDestroy {
  loginMode: boolean = true;
  loading: boolean = false;
  error: string = '';
  storeSub: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.storeSub = this.store.select('auth').subscribe((authState) => {
      console.log('authState', authState);
      this.loading = authState.loading;
      this.error = authState.authError;
    });
  }

  toggleMode() {
    this.loginMode = !this.loginMode;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) return;

    let authSub: Observable<AuthResponse>;

    this.loading = true;
    if (this.loginMode) {
      // authSub = this.authService.login({
      //   email: form.value.email,
      //   password: form.value.password,
      // });
      this.store.dispatch(
        new authActions.LoginStart({
          email: form.value.email,
          password: form.value.password,
        })
      );
    } else {
      authSub = this.authService.register({
        email: form.value.email,
        password: form.value.password,
      });
    }

    // authSub.subscribe(
    //   (response) => {
    //     console.log('auth response', response);
    //     this.loading = false;
    //     this.error = '';
    //     this.router.navigate(['/recipes']);
    //   },
    //   (error) => {
    //     this.loading = false;
    //     this.error = error.message;
    //     console.log('error in auth');
    //     console.log(error);
    //   }
    // );

    form.reset();
  }

  ngOnDestroy() {
    this.storeSub.unsubscribe();
  }
}
