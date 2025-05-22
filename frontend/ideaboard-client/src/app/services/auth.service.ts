import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private base = `${environment.apiUrl}/auth`;

  constructor(
    private http: HttpClient, 
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  register(name: string, email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.base}/register`, { name, email, password }).pipe(
      tap(res => {
        if (res && res.token && this.isBrowser()) {
          localStorage.setItem('token', res.token);
          this.router.navigate(['/meetings']);
        }
      })
    );
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.base}/login`, { email, password }).pipe(
      tap(res => {
        if (res && res.token && this.isBrowser()) {
          localStorage.setItem('token', res.token);
          this.router.navigate(['/meetings']);
        }
      })
    );
  }

  logout(): void {
    if (this.isBrowser()) {
      localStorage.removeItem('token');
    }
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    // Add more sophisticated token validation if needed (e.g., check expiration)
    return !!token;
  }

  getToken(): string | null {
    if (this.isBrowser()) {
      return localStorage.getItem('token');
    }
    return null;
  }
}