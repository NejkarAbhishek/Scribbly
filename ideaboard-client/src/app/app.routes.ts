import { Routes } from '@angular/router';
import { LandingComponent } from './features/landing/landing.component';
import { LoginComponent } from './features/auth/login.component';
import { RegisterComponent } from './features/auth/register.component';
import { CreateMeetingComponent } from './features/meetings/create-meeting.component';
import { JoinMeetingComponent } from './features/meetings/join-meeting.component';
import { MeetingListComponent } from './features/meetings/meeting-list.component';
import { WhiteboardComponent } from './features/whiteboard/whiteboard.component';
import { AuthGuard } from './guards/auth.guard';

export const appRoutes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'create', component: CreateMeetingComponent, canActivate: [AuthGuard] },
  { path: 'join', component: JoinMeetingComponent, canActivate: [AuthGuard] },
  { path: 'meetings', component: MeetingListComponent, canActivate: [AuthGuard] },
  { path: 'whiteboard/:id', component: WhiteboardComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '' }
];