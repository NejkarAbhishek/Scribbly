// src/app/meeting-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MeetingService, Meeting } from './services/meeting.service';

@Component({
  selector: 'app-meeting-list',
  standalone: true,
  imports: [CommonModule, RouterModule, DatePipe],
  templateUrl: './meeting-list.component.html',
  styleUrls: ['./meeting-list.component.scss']
})
export class MeetingListComponent implements OnInit {
  meetings: Meeting[] = [];
  error = '';
  loading = true;

  constructor(
    private meetingService: MeetingService,
    private router: Router
  ) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading = true;
    this.meetingService.getMeetings().subscribe({
      next: (meetings) => {
        this.meetings = meetings.filter((m: Meeting) => m.isActive);
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Could not load meetings. Please try again later.';
        this.loading = false;
      }
    });
  }

  open(id: string) {
    this.router.navigate(['/whiteboard', id]);
  }

  end(id: string) {
    this.meetingService.endMeeting(id).subscribe({
      next: () => this.load(),
      error: () => this.error = 'Failed to end meeting. Please try again.'
    });
  }
}
