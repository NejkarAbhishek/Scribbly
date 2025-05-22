import { Component, OnInit } from '@angular/core';
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
  
  constructor(public auth: AuthService, private router: Router) {}
  
  ngOnInit() {
    // Hide navbar on whiteboard page
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.showNavbar = !event.url.includes('/whiteboard/');
    });
  }

  logout() {
    this.auth.logout();
    // AuthService's logout method already navigates to /login
    // If you want to navigate to '/' specifically after logout:
    // this.router.navigate(['/']);
  }
}