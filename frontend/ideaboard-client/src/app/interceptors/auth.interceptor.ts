import { Injectable, inject } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpInterceptorFn } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

// Functional interceptor for use with withInterceptors
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();
  
  console.log(`Interceptor - Request URL: ${req.url}`);
  console.log(`Interceptor - Token exists: ${!!token}`);
  
  if (token) {
    console.log(`Interceptor - Adding token header. Token starts with: ${token.substring(0, 15)}...`);
    // Clone the request and add the token as an Authorization header
    const authRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(authRequest);
  } else {
    console.log('Interceptor - No token available, proceeding without Authorization header');
  }
  
  // If no token, proceed with the original request
  return next(req);
};

// Keep the class-based implementation for backward compatibility
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.auth.getToken();
    
    if (token) {
      // Clone the request and add the token as an Authorization header
      const authRequest = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      return next.handle(authRequest);
    }
    
    // If no token, proceed with the original request
    return next.handle(request);
  }
} 