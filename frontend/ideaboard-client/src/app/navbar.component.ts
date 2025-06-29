import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { AuthService } from './services/auth.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  isLoggedIn = false;
  currentRoute = '';
  showNavbar = true;

  constructor(public auth: AuthService, private router: Router) {}

  ngOnInit() {
    this.isLoggedIn = this.auth.isLoggedIn();
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.currentRoute = event.url;
      this.isLoggedIn = this.auth.isLoggedIn();
      // Hide navbar on whiteboard route
      this.showNavbar = !this.currentRoute.startsWith('/whiteboard');
    });
  }

  isActive(route: string): boolean {
    return this.currentRoute.startsWith(route);
  }

  logout() {
    this.auth.logout();
  }
} 