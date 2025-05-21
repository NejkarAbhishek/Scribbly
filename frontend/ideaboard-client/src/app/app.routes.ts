import { Routes } from '@angular/router';
import { LandingComponent } from '../app/landing.component';
import { LoginComponent } from '../app/login.component';
import { CreateMeetingComponent } from './app/create-meeting.component';
import { JoinMeetingComponent } from './app/join-meeting.component';
import { MeetingListComponent } from './app/meeting-list.component';
import { WhiteboardComponent } from '../app/whiteboard.component';
import { AuthGuard } from './guards/auth.guard';

export const appRoutes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  { path: 'create', component: CreateMeetingComponent, canActivate: [AuthGuard] },
  { path: 'join', component: JoinMeetingComponent, canActivate: [AuthGuard] },
  { path: 'meetings', component: MeetingListComponent, canActivate: [AuthGuard] },
  { path: 'whiteboard/:id', component: WhiteboardComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '' }
];