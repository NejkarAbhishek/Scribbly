import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from './services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  submit() {
    this.error = '';
    if (!this.email.trim()) {
      this.error = 'Email is required.';
      return;
    }
    if (!this.password.trim()) {
      this.error = 'Password is required.';
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.error = 'Please enter a valid email address.';
      return;
    }
    
    this.auth.login(this.email, this.password).subscribe({
      next: () => {
        this.router.navigate(['/meetings']);
      },
      error: (err: HttpErrorResponse) => { 
        console.error('Login error:', err);
        this.error = err.error?.message || 'Login failed. Please check your credentials.';
      }
    });
  }
}
