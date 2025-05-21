import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private base = `${environment.apiUrl}/auth`;
  constructor(private http: HttpClient, private router: Router) {}
  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.base}/login`, { email, password }).pipe(
      tap(res => localStorage.setItem('token', res.token))
    );
  }
  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
  getToken(): string | null {
    return localStorage.getItem('token');
  }
}