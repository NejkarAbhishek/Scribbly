// src/app/meeting-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MeetingService, Meeting } from '../../services/meeting.service';

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

  page = 1;
  limit = 10;
  hasMore = false;

  constructor(
    private meetingService: MeetingService,
    private router: Router
  ) { }

  ngOnInit() {
    this.load();
  }

  load(loadMore = false) {
    if (loadMore) {
      this.page++;
    } else {
      this.page = 1;
      this.meetings = [];
    }

    this.loading = true;
    this.meetingService.getMeetings(this.page, this.limit).subscribe({
      next: (response) => {
        if (loadMore) {
          this.meetings = [...this.meetings, ...response.meetings];
        } else {
          this.meetings = response.meetings;
        }
        this.hasMore = this.page < response.pages;
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
