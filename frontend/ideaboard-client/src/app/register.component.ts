import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from './services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  confirmPassword = '';
  agreedToTerms = false;
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  submit() {
    this.error = '';
    
    if (!this.name.trim()) {
      this.error = 'Full Name is required.';
      return;
    }
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

    if (this.password !== this.confirmPassword) {
      this.error = 'Passwords do not match.';
      return;
    }
    
    if (this.password.length < 6) {
      this.error = 'Password must be at least 6 characters long.';
      return;
    }

    if (!/[A-Z]/.test(this.password)) {
      this.error = 'Password must contain at least one uppercase letter.';
      return;
    }
    if (!/[a-z]/.test(this.password)) {
      this.error = 'Password must contain at least one lowercase letter.';
      return;
    }
    if (!/[0-9]/.test(this.password)) {
      this.error = 'Password must contain at least one number.';
      return;
    }

    this.auth.register(this.name, this.email, this.password).subscribe({
      next: () => {
        this.router.navigate(['/meetings']);
      },
      error: (err: HttpErrorResponse) => { 
        console.error('Registration error:', err);
        if (err.status === 400 && err.error?.message === 'Email already registered') {
          this.error = 'This email is already registered. Please try logging in or use a different email.';
        } else {
          this.error = err.error?.message || 'Registration failed. Please try again.';
        }
      }
    });
  }
} 