import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MeetingService } from './services/meeting.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-join-meeting',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './join-meeting.component.html',
  styleUrls: ['./join-meeting.component.scss']
})
export class JoinMeetingComponent {
  code = '';
  error = '';
  isLoading = false;

  constructor(
    private meetingService: MeetingService,
    private router: Router
  ) {}

  join() {
    this.error = '';
    if (!this.code.trim()) {
      this.error = 'Meeting code is required.';
      return;
    }

    this.isLoading = true;
    this.meetingService.joinMeeting(this.code)
      .subscribe({
        next: ({ meetingId }) => {
          this.isLoading = false;
          this.router.navigate(['/whiteboard', meetingId]);
        },
        error: (err: HttpErrorResponse) => {
          this.isLoading = false;
          this.error = err.error?.message || 'Invalid code or meeting no longer active';
        }
      });
  }
}