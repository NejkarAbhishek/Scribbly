import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

export interface Meeting {
  _id: string;
  code: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  members: Array<{ userId: string }>;
}

@Injectable({ providedIn: 'root' })
export class MeetingService {
  private base = `${environment.apiUrl}/meetings`;

  constructor(private http: HttpClient, private auth: AuthService) {}

  private headers(): { headers: HttpHeaders } {
    const token = this.auth.getToken();
    console.log('MeetingService - headers() - token exists:', !!token);
    
    if (!token) {
      console.error('MeetingService - No token available for API request');
    } else {
      console.log('MeetingService - Using token for request: ', token.substring(0, 10) + '...');
    }
    
    return {
      headers: new HttpHeaders({ 
        Authorization: token ? `Bearer ${token}` : '' 
      })
    };
  }

  createMeeting(name: string, description: string): Observable<{ id: string; code: string }> {
    console.log('MeetingService - createMeeting - making request with name:', name);
    return this.http.post<{ id: string; code: string }>(`${this.base}/create`, { name, description }, this.headers());
  }

  joinMeeting(code: string): Observable<{ meetingId: string }> {
    console.log('MeetingService - joinMeeting - making request with code:', code);
    return this.http.post<{ meetingId: string }>(`${this.base}/join-by-code`, { code: code.trim() }, this.headers());
  }

  getMeetings(): Observable<Meeting[]> {
    console.log('MeetingService - getMeetings - making request');
    return this.http.get<Meeting[]>(`${this.base}`, this.headers());
  }

  getMeetingById(id: string): Observable<Meeting> {
    console.log('MeetingService - getMeetingById - making request for id:', id);
    return this.http.get<Meeting>(`${this.base}/${id}`, this.headers());
  }

  endMeeting(id: string): Observable<any> {
    console.log('MeetingService - endMeeting - making request for id:', id);
    return this.http.patch(`${this.base}/${id}/end`, {}, this.headers());
  }
}