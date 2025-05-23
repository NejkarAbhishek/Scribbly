import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MeetingService } from './services/meeting.service';
import { AuthService } from './services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-create-meeting',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './create-meeting.component.html',
  styleUrls: ['./create-meeting.component.scss']
})
export class CreateMeetingComponent implements OnInit {
  name = '';
  description = '';
  error = '';
  isLoading = false;
  tokenStatus = '';

  constructor(
    private meetingService: MeetingService,
    private authService: AuthService,
    private router: Router
  ) {}
  
  ngOnInit() {
    // Debug token status
    const token = this.authService.getToken();
    this.tokenStatus = token ? 'Token exists' : 'No token found';
    console.log('CreateMeeting Component - Token status:', this.tokenStatus);
    if (token) {
      console.log('Token value (first 15 chars):', token.substring(0, 15) + '...');
    }
  }

  create() {
    this.error = '';
    if (!this.name.trim()) {
      this.error = 'Meeting name is required.';
      return;
    }
    
    // Check token again before submit
    const token = this.authService.getToken();
    if (!token) {
      this.error = 'You need to be logged in. Please log in again.';
      this.router.navigate(['/login']);
      return;
    }

    this.isLoading = true;
    this.meetingService.createMeeting(this.name, this.description)
      .subscribe({
        next: ({ id, code }) => {
          console.log(`Meeting created with code: ${code}`);
          this.isLoading = false;
          this.router.navigate(['/whiteboard', id]);
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error creating meeting:', err);
          console.error('Error status:', err.status);
          console.error('Error status text:', err.statusText);
          console.error('Error message:', err.message);
          console.error('Full error response:', err.error);
          
          this.error = err.error?.message || 'Failed to create meeting';
          this.isLoading = false;
        }
      });
  }
}