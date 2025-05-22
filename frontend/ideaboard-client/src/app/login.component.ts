import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from './services/auth.service';

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
    if (!this.email || !this.password) {
      this.error = 'Email and password are required.';
      return;
    }
    
    this.auth.login(this.email, this.password).subscribe({
      next: () => {
        this.router.navigate(['/meetings']);
      },
      error: err => this.error = err.error?.message || 'Login failed'
    });
  }
}
