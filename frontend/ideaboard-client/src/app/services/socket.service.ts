import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SocketService {
  private socket!: Socket;
  connect(token: string): void {
    this.socket = io(environment.socketUrl, { auth: { token } });
  }
  disconnect(): void {
    this.socket.disconnect();
  }
  joinMeeting(meetingId: string): void {
    this.socket.emit('joinMeeting', meetingId);
  }
  leaveMeeting(meetingId: string): void {
    this.socket.emit('leaveMeeting', meetingId);
  }
  sendSignal(meetingId: string, data: any): void {
    this.socket.emit('signal', { meetingId, data });
  }
  onUserJoined(): Observable<string> {
    return new Observable(observer => {
      this.socket.on('userJoined', id => observer.next(id));
    });
  }
  onUserLeft(): Observable<string> {
    return new Observable(observer => {
      this.socket.on('userLeft', id => observer.next(id));
    });
  }
  onSignal(): Observable<{ from: string; data: any }> {
    return new Observable(observer => {
      this.socket.on('signal', payload => observer.next(payload));
    });
  }
  onChat(): Observable<{ user: string; message: string }> {
    return new Observable(observer => {
      this.socket.on('chat', msg => observer.next(msg));
    });
  }
  sendChat(message: string): void {
    this.socket.emit('chat', message);
  }
}