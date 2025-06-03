import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { tap, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private base = `${environment.apiUrl}/auth`;

  constructor(
    private http: HttpClient, 
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    console.log('Auth service initialized with API URL:', this.base);
  }

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  private handleError(error: HttpErrorResponse) {
    console.error('API Error:', error);
    
    let errorMessage = 'An unknown error occurred';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = error.error?.message || `Error Code: ${error.status}, Message: ${error.message}`;
    }
    
    return throwError(() => new Error(errorMessage));
  }

  register(name: string, email: string, password: string): Observable<any> {
    console.log('Attempting to register user:', email);
    return this.http.post<any>(`${this.base}/register`, { name, email, password }).pipe(
      tap(res => {
        console.log('Registration response:', res);
        if (res && res.token && this.isBrowser()) {
          localStorage.setItem('token', res.token);
          if (res.name) localStorage.setItem('name', res.name);
          console.log('Token and name saved to localStorage after registration');
          this.router.navigate(['/meetings']);
        } else {
          console.error('No token received in registration response', res);
        }
      }),
      catchError(this.handleError.bind(this))
    );
  }

  login(email: string, password: string): Observable<any> {
    console.log('Attempting to login user:', email);
    return this.http.post<any>(`${this.base}/login`, { email, password }).pipe(
      tap(res => {
        console.log('Login response:', res);
        if (res && res.token && this.isBrowser()) {
          localStorage.setItem('token', res.token);
          if (res.name) localStorage.setItem('name', res.name);
          console.log('Token and name saved to localStorage after login');
          this.router.navigate(['/meetings']);
        } else {
          console.error('No token received in login response', res);
        }
      }),
      catchError(this.handleError.bind(this))
    );
  }

  logout(): void {
    if (this.isBrowser()) {
      localStorage.removeItem('token');
      console.log('Token removed from localStorage');
    }
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    console.log('isLoggedIn check - token exists:', !!token);
    // Add more sophisticated token validation if needed (e.g., check expiration)
    return !!token;
  }

  getToken(): string | null {
    if (this.isBrowser()) {
      const token = localStorage.getItem('token');
      console.log('getToken called - token exists:', !!token);
      return token;
    }
    return null;
  }

  // Debug method to check token status
  debugTokenStatus(): void {
    if (this.isBrowser()) {
      const token = localStorage.getItem('token');
      console.log('TOKEN DEBUG - exists:', !!token);
      console.log('TOKEN DEBUG - value:', token ? token.substring(0, 10) + '...' : 'null');
    } else {
      console.log('TOKEN DEBUG - not in browser context');
    }
  }

  // Test connection to backend
  testConnection(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/test`).pipe(
      tap(res => console.log('API Test Response:', res)),
      catchError(this.handleError.bind(this))
    );
  }
}