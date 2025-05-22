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
    return {
      headers: new HttpHeaders({ Authorization: `Bearer ${token}` })
    };
  }

  createMeeting(name: string, description: string): Observable<{ id: string; code: string }> {
    return this.http.post<{ id: string; code: string }>(`${this.base}`, { name, description }, this.headers());
  }

  joinMeeting(code: string): Observable<{ meetingId: string }> {
    return this.http.post<{ meetingId: string }>(`${this.base}/join`, { code }, this.headers());
  }

  getMeetings(): Observable<Meeting[]> {
    return this.http.get<Meeting[]>(`${this.base}`, this.headers());
  }

  endMeeting(id: string): Observable<any> {
    return this.http.patch(`${this.base}/${id}/end`, {}, this.headers());
  }
}