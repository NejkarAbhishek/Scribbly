// src/app/meeting-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MeetingService, Meeting } from './services/meeting.service';

@Component({
  selector: 'app-meeting-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './meeting-list.component.html'
})
export class MeetingListComponent implements OnInit {
  meetings: Meeting[] = [];
  error = '';

  constructor(
    private meetingService: MeetingService,
    private router: Router
  ) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.meetingService.getMeetings().subscribe({
      next: ms => this.meetings = ms.filter(m => m.isActive),
      error: err => this.error = 'Could not load sessions'
    });
  }

  open(id: string) {
    this.router.navigate(['/whiteboard', id]);
  }

  end(id: string) {
    this.meetingService.endMeeting(id).subscribe({
      next: () => this.load(),
      error: () => this.error = 'Failed to end session'
    });
  }
}
