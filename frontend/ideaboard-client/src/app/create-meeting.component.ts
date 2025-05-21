// src/app/create-meeting.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MeetingService } from './services/meeting.service';

@Component({
  selector: 'app-create-meeting',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: '../app/create-meeting.component.html'
})
export class CreateMeetingComponent {
  name = '';
  description = '';
  error = '';

  constructor(
    private meetingService: MeetingService,
    private router: Router
  ) {}

  create() {
    this.error = '';
    this.meetingService.createMeeting(this.name, this.description)
      .subscribe({
        next: ({ id, code }) => {
          // You might want to display 'code' somewhere
          this.router.navigate(['/whiteboard', id]);
        },
        error: err => this.error = err.error?.message || 'Failed to create session'
      });
  }
}
