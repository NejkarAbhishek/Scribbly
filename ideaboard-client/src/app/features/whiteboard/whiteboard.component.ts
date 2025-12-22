import { Component, ElementRef, OnInit, ViewChild, OnDestroy, HostListener, NgZone, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SocketService } from '../../services/socket.service';
import { MeetingService } from '../../services/meeting.service';
import { Subject, takeUntil, throttleTime, fromEvent } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

interface DrawData {
  x: number;
  y: number;
  color: string;
  size: number;
  type?: string;
  prevX?: number;
  prevY?: number;
}

interface ChatMessage {
  user: string;
  message: string;
  timestamp?: Date;
}

@Component({
  selector: 'app-whiteboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './whiteboard.component.html',
  styleUrls: ['./whiteboard.component.scss']
})
export class WhiteboardComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  ctx!: CanvasRenderingContext2D;


  drawing = false;
  color = '#000000';
  size = 5;
  prevX = 0;
  prevY = 0;

  activeTool = 'brush';
  colors: string[] = ['#000000', '#ffffff', '#f44336', '#2196f3', '#4caf50', '#ffeb3b', '#ff9800', '#9c27b0'];


  showChat = false;
  isMobileView = false;


  meetingId!: string;
  meetingCode = '';
  meetingName = '';


  chatMsg = '';
  chatLog: ChatMessage[] = [];

  private destroy$ = new Subject<void>();
  private drawSubject = new Subject<DrawData>();

  constructor(
    private route: ActivatedRoute,
    private socket: SocketService,
    private meetingService: MeetingService,
    private toastr: ToastrService,
    private router: Router,
    private ngZone: NgZone
  ) { }

  ngOnInit() {
    this.meetingId = this.route.snapshot.paramMap.get('id')!;
    this.connectSocket();
    this.checkScreenSize();
    this.getMeetingInfo();


    this.drawSubject.pipe(
      takeUntil(this.destroy$),
      throttleTime(10)
    ).subscribe(data => {
      this.socket.sendSignal(this.meetingId, data);
    });
  }

  ngAfterViewInit() {
    this.setupCanvas();
    this.setupCanvasEvents();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.socket.leaveMeeting(this.meetingId);
  }

  @HostListener('window:resize')
  checkScreenSize() {
    this.isMobileView = window.innerWidth < 768;
    if (this.isMobileView) {
      this.showChat = false;
    }
  }

  setupCanvas() {
    this.ctx = this.canvas.nativeElement.getContext('2d')!;
    this.resizeCanvas();
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
  }

  setupCanvasEvents() {
    this.ngZone.runOutsideAngular(() => {
      const canvasEl = this.canvas.nativeElement;

      fromEvent<MouseEvent>(canvasEl, 'mousedown').pipe(takeUntil(this.destroy$)).subscribe(e => this.startDraw(e));
      fromEvent<MouseEvent>(canvasEl, 'mousemove').pipe(takeUntil(this.destroy$)).subscribe(e => this.draw(e));
      fromEvent<MouseEvent>(canvasEl, 'mouseup').pipe(takeUntil(this.destroy$)).subscribe(() => this.endDraw());
      fromEvent<MouseEvent>(canvasEl, 'mouseleave').pipe(takeUntil(this.destroy$)).subscribe(() => this.endDraw());
    });
  }

  resizeCanvas() {
    const container = this.canvas.nativeElement.parentElement;
    if (container) {
      this.canvas.nativeElement.width = container.clientWidth;
      this.canvas.nativeElement.height = container.clientHeight;
    }
  }

  connectSocket() {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    this.socket.connect(token);
    this.socket.joinMeeting(this.meetingId);

    this.socket.onSignal().pipe(
      takeUntil(this.destroy$)
    ).subscribe(({ data }) => this.drawRemote(data));

    this.socket.onChat().pipe(
      takeUntil(this.destroy$)
    ).subscribe(msg => {
      this.ngZone.run(() => {
        this.chatLog.push({
          user: msg.name || msg.user,
          message: msg.message,
          timestamp: new Date()
        });
      });
    });
  }

  getMeetingInfo() {
    this.meetingService.getMeetingById(this.meetingId).subscribe({
      next: (meeting) => {
        this.meetingCode = meeting.code;
        this.meetingName = meeting.name;
        this.toastr.success(`Connected to meeting: ${meeting.name}`, 'Connected');
      },
      error: (error) => {
        this.toastr.error('Failed to load meeting details', 'Error');
      }
    });
  }

  startDraw(e: MouseEvent) {
    this.drawing = true;
    const rect = this.canvas.nativeElement.getBoundingClientRect();
    this.prevX = e.clientX - rect.left;
    this.prevY = e.clientY - rect.top;

    this.ctx.beginPath();
    this.ctx.moveTo(this.prevX, this.prevY);
  }

  draw(e: MouseEvent) {
    if (!this.drawing) return;

    const rect = this.canvas.nativeElement.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (this.activeTool === 'eraser') {
      this.ctx.strokeStyle = '#FFFFFF';
      this.ctx.lineWidth = this.size * 2;
    } else {
      this.ctx.strokeStyle = this.color;
      this.ctx.lineWidth = this.size;
    }

    this.ctx.lineTo(x, y);
    this.ctx.stroke();

    const drawData: DrawData = {
      x: x,
      y: y,
      prevX: this.prevX,
      prevY: this.prevY,
      color: this.activeTool === 'eraser' ? '#FFFFFF' : this.color,
      size: this.activeTool === 'eraser' ? this.size * 2 : this.size,
      type: 'line'
    };


    this.drawSubject.next(drawData);

    this.prevX = x;
    this.prevY = y;
  }

  endDraw() {
    this.drawing = false;
  }

  drawRemote(data: DrawData) {
    if (!this.ctx) return;

    this.ctx.strokeStyle = data.color;
    this.ctx.lineWidth = data.size;

    if (data.type === 'line' && data.prevX && data.prevY) {
      this.ctx.beginPath();
      this.ctx.moveTo(data.prevX, data.prevY);
      this.ctx.lineTo(data.x, data.y);
      this.ctx.stroke();
    } else {
      this.ctx.lineTo(data.x, data.y);
      this.ctx.stroke();
    }
  }

  setTool(tool: string) {
    this.activeTool = tool;
  }

  setColor(color: string) {
    this.color = color;
    this.activeTool = 'brush';
  }

  clearCanvas() {
    if (confirm('Are you sure you want to clear the whiteboard?')) {
      this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
      this.socket.sendSignal(this.meetingId, { type: 'clear' });
      this.toastr.info('Whiteboard cleared', 'Cleared');
    }
  }

  toggleChat() {
    this.showChat = !this.showChat;
  }

  sendChat() {
    if (!this.chatMsg.trim()) return;
    const myName = localStorage.getItem('name') || 'Me';
    this.socket.sendChat({ message: this.chatMsg, name: myName });
    this.chatMsg = '';
  }

  leaveMeeting() {
    if (confirm('Are you sure you want to leave this meeting?')) {
      this.router.navigate(['/meetings']);
    }
  }

  copyMeetingCode() {
    navigator.clipboard.writeText(this.meetingCode);
    this.toastr.success(`Code copied: ${this.meetingCode}`, 'Meeting Code', {
      timeOut: 2000
    });
  }
}
