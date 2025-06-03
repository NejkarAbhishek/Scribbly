import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SocketService {
  private socket!: Socket;

  connect(token: string): void {
    if (!this.socket || this.socket.disconnected) {
      this.socket = io(environment.socketUrl, {
        auth: { token }
      });
    }
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  joinMeeting(meetingId: string): void {
    if (this.socket) {
      this.socket.emit('joinMeeting', meetingId);
    }
  }

  leaveMeeting(meetingId: string): void {
    if (this.socket) {
      this.socket.emit('leaveMeeting', meetingId);
    }
  }

  sendSignal(meetingId: string, data: any): void {
    if (this.socket) {
      this.socket.emit('signal', { meetingId, data });
    }
  }

  onUserJoined(): Observable<string> {
    return new Observable(observer => {
      if (this.socket) {
        this.socket.on('userJoined', (id: string) => observer.next(id));
      }
      // Cleanup when observable is unsubscribed
      return () => {
        if (this.socket) {
          this.socket.off('userJoined');
        }
      };
    });
  }

  onUserLeft(): Observable<string> {
    return new Observable(observer => {
      if (this.socket) {
        this.socket.on('userLeft', (id: string) => observer.next(id));
      }
      return () => {
        if (this.socket) {
          this.socket.off('userLeft');
        }
      };
    });
  }

  onSignal(): Observable<{ from: string; data: any }> {
    return new Observable(observer => {
      if (this.socket) {
        this.socket.on('signal', (payload: { from: string; data: any }) => observer.next(payload));
      }
      return () => {
        if (this.socket) {
          this.socket.off('signal');
        }
      };
    });
  }

  onChat(): Observable<{ user: string; name?: string; message: string }> {
    return new Observable(observer => {
      if (this.socket) {
        this.socket.on('chat', (msg: { user: string; name?: string; message: string }) => observer.next(msg));
      }
      return () => {
        if (this.socket) {
          this.socket.off('chat');
        }
      };
    });
  }

  sendChat(data: { message: string; name: string }): void {
    if (this.socket) {
      this.socket.emit('chat', data);
    }
  }
}