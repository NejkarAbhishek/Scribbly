import { Component } from '@angular/core';
import { AuthService } from '../app/services/auth.service';
import { Router } from '@angular/router';

@Component({ selector: 'app-login', templateUrl: './login.component.html' })
export class LoginComponent {
  email = '';
  password = '';
  error = '';
  constructor(private auth: AuthService, private router: Router) {}
  login() {
    this.auth.login(this.email, this.password).subscribe(
      () => this.router.navigate(['/create']),
      err => this.error = err.error.message
    );
  }
}