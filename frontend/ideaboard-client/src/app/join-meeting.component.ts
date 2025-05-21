// src/app/join-meeting.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MeetingService } from './services/meeting.service';

@Component({
  selector: 'app-join-meeting',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: '../app/join-meeting.component.html'
})
export class JoinMeetingComponent {
  code = '';
  error = '';

  constructor(
    private meetingService: MeetingService,
    private router: Router
  ) {}

  join() {
    this.error = '';
    this.meetingService.joinMeeting(this.code)
      .subscribe({
        next: ({ meetingId }) => {
          this.router.navigate(['/whiteboard', meetingId]);
        },
        error: err => this.error = err.error?.message || 'Invalid code or session ended'
      });
  }
}
