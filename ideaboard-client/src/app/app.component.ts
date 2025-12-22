import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { AuthService } from './services/auth.service';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  showNavbar = false;

  constructor(public auth: AuthService, private router: Router) { }

  ngOnInit() {
    // Test backend connection
    this.testBackendConnection();

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const url = event.urlAfterRedirects || event.url;
      // Hide navbar on landing page ('/') and whiteboard
      this.showNavbar = url !== '/' && !url.startsWith('/whiteboard');

      // Apply zoom to all pages except whiteboard
      if (url.startsWith('/whiteboard')) {
        document.body.classList.remove('zoomed-layout');
      } else {
        document.body.classList.add('zoomed-layout');
      }
    });
  }

  testBackendConnection() {
    this.auth.testConnection().subscribe({
      next: (res) => console.log('Backend connection successful:', res),
      error: (err) => console.error('Backend connection failed:', err)
    });
  }
}