import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SocketService } from '../app/services/socket.service';

@Component({ selector: 'app-whiteboard', templateUrl: '../app/whiteboard.component.html' })
export class WhiteboardComponent implements OnInit {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  ctx!: CanvasRenderingContext2D;
  drawing = false;
  color = '#000000';
  size = 5;
  chatMsg = '';
  chatLog: Array<{ user: string; message: string }> = [];
  meetingId!: string;
  constructor(private route: ActivatedRoute, private socket: SocketService) {}

  ngOnInit() {
    this.meetingId = this.route.snapshot.paramMap.get('id')!;
    this.ctx = this.canvas.nativeElement.getContext('2d')!;
    this.socket.connect(localStorage.getItem('token')!);
    this.socket.joinMeeting(this.meetingId);
    this.socket.onSignal().subscribe(({ data }) => this.drawRemote(data));
    this.socket.onChat().subscribe(msg => this.chatLog.push(msg));
  }

  startDraw(e: MouseEvent) {
    this.drawing = true;
    this.ctx.beginPath();
    this.ctx.moveTo(e.offsetX, e.offsetY);
  }
  draw(e: MouseEvent) {
    if (!this.drawing) return;
    this.ctx.strokeStyle = this.color;
    this.ctx.lineWidth = this.size;
    this.ctx.lineTo(e.offsetX, e.offsetY);
    this.ctx.stroke();
    this.socket.sendSignal(this.meetingId, { x: e.offsetX, y: e.offsetY, color: this.color, size: this.size });
  }
  endDraw() { this.drawing = false; }
  drawRemote(data: any) {
    this.ctx.strokeStyle = data.color;
    this.ctx.lineWidth = data.size;
    this.ctx.lineTo(data.x, data.y);
    this.ctx.stroke();
  }
  sendChat() {
    this.socket.sendChat(this.chatMsg);
    this.chatLog.push({ user: 'Me', message: this.chatMsg });
    this.chatMsg = '';
  }
}
