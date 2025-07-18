import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { AuthService } from './services/auth.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  showNavbar = true;
  currentRoute = '';
  
  constructor(public auth: AuthService, private router: Router) {}
  
  ngOnInit() {
    // Debug token status
    this.auth.debugTokenStatus();
    
    // Test backend connection
    this.testBackendConnection();
    
    // Always show navbar
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.currentRoute = event.url;
      // Hide navbar on whiteboard route
      this.showNavbar = !this.currentRoute.startsWith('/whiteboard');
    });
  }

  isActive(route: string): boolean {
    return this.currentRoute.startsWith(route);
  }

  logout() {
    this.auth.logout();
    // AuthService's logout method already navigates to /login
    // If you want to navigate to '/' specifically after logout:
    // this.router.navigate(['/']);
  }
  
  testBackendConnection() {
    this.auth.testConnection().subscribe({
      next: (res) => console.log('Backend connection successful:', res),
      error: (err) => console.error('Backend connection failed:', err)
    });
  }
}