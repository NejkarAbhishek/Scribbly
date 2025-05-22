import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MeetingService } from './services/meeting.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-create-meeting',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './create-meeting.component.html',
  styleUrls: ['./create-meeting.component.scss']
})
export class CreateMeetingComponent {
  name = '';
  description = '';
  error = '';
  isLoading = false;

  constructor(
    private meetingService: MeetingService,
    private router: Router
  ) {}

  create() {
    this.error = '';
    if (!this.name.trim()) {
      this.error = 'Meeting name is required.';
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
          this.error = err.error?.message || 'Failed to create meeting';
          this.isLoading = false;
        }
      });
  }
}