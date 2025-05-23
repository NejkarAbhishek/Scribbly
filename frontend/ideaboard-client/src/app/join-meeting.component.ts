import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MeetingService } from './services/meeting.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

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
    private router: Router,
    private toastr: ToastrService
  ) {}

  join() {
    this.error = '';
    if (!this.code.trim()) {
      this.error = 'Meeting code is required.';
      this.toastr.warning('Please enter a meeting code', 'Required Field');
      return;
    }

    console.log('Attempting to join meeting with code:', this.code);
    this.isLoading = true;
    this.meetingService.joinMeeting(this.code.trim())
      .subscribe({
        next: ({ meetingId }) => {
          console.log('Successfully joined meeting with ID:', meetingId);
          this.isLoading = false;
          this.toastr.success('Successfully joined the meeting', 'Joined');
          this.router.navigate(['/whiteboard', meetingId]);
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error joining meeting:', err);
          console.error('Error status:', err.status);
          console.error('Error status text:', err.statusText);
          console.error('Error message:', err.message);
          console.error('Full error response:', err.error);
          
          this.isLoading = false;
          this.error = err.error?.message || 'Invalid code or meeting no longer active';
          this.toastr.error(this.error, 'Join Failed');
        }
      });
  }
}