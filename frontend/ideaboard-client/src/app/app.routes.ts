import { Routes } from '@angular/router';
import { LandingComponent } from './landing.component';
import { LoginComponent } from './login.component';
import { RegisterComponent } from './register.component';
import { CreateMeetingComponent } from './create-meeting.component';
import { JoinMeetingComponent } from './join-meeting.component';
import { MeetingListComponent } from './meeting-list.component';
import { WhiteboardComponent } from './whiteboard.component';
import { AuthGuard } from './guards/auth.guard';

export const appRoutes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'create', component: CreateMeetingComponent, canActivate: [AuthGuard] },
  { path: 'join', component: JoinMeetingComponent, canActivate: [AuthGuard] },
  { path: 'meetings', component: MeetingListComponent, canActivate: [AuthGuard] },
  { path: 'whiteboard/:id', component: WhiteboardComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '' } // Wildcard route for a 404-like redirect to landing
];