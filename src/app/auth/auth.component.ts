import { AuthService, AuthResponse } from './auth.service';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  loginMode: boolean = true;
  loading: boolean = false;
  error: string = ''

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  toggleMode() {
    this.loginMode = !this.loginMode;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) return;

    let authSub: Observable<AuthResponse>;

    this.loading = true;
    if (this.loginMode) {
      authSub = this.authService.login({
        email: form.value.email,
        password: form.value.password,
      });
    } else {
      authSub = this.authService.register({
        email: form.value.email,
        password: form.value.password,
      });
    }

    authSub.subscribe(
      (response) => {
        console.log('auth response', response);
        this.loading = false;
        this.error = ''
        this.router.navigate(['/recipes'])
      },
      (error) => {
        this.loading = false;
        this.error = error.message
        console.log('error in auth');
        console.log(error);
      }
    );

    form.reset();
  }
}
