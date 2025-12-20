import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { tap, catchError } from 'rxjs/operators';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private base = `${environment.apiUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<any | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (this.isBrowser()) {
      const token = localStorage.getItem('token');
      const name = localStorage.getItem('name');
      if (token && name) {
        this.currentUserSubject.next({ name });
      }
    }
  }

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  private handleError(error: HttpErrorResponse) {

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
    return this.http.post<any>(`${this.base}/register`, { name, email, password }).pipe(
      tap(res => {
        if (res && res.token && this.isBrowser()) {
          localStorage.setItem('token', res.token);
          if (res.name) localStorage.setItem('name', res.name);
          this.currentUserSubject.next({ name: res.name || name });
          this.router.navigate(['/meetings']);
        } else {
        }
      }),
      catchError(this.handleError.bind(this))
    );
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.base}/login`, { email, password }).pipe(
      tap(res => {
        if (res && res.token && this.isBrowser()) {
          localStorage.setItem('token', res.token);
          if (res.name) localStorage.setItem('name', res.name);
          this.currentUserSubject.next({ name: res.name });
          this.router.navigate(['/meetings']);
        } else {
        }
      }),
      catchError(this.handleError.bind(this))
    );
  }

  logout(): void {
    if (this.isBrowser()) {
      localStorage.removeItem('token');
      localStorage.removeItem('name');
    }
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    // Add more sophisticated token validation if needed (e.g., check expiration)
    return !!token;
  }

  getToken(): string | null {
    if (this.isBrowser()) {
      const token = localStorage.getItem('token');
      return token;
    }
    return null;
  }

  // Test connection to backend
  testConnection(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/test`).pipe(
      catchError(this.handleError.bind(this))
    );
  }
}