import { Component, ElementRef, OnInit, ViewChild, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SocketService } from './services/socket.service';
import { MeetingService } from './services/meeting.service';
import { Subject, takeUntil } from 'rxjs';
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
export class WhiteboardComponent implements OnInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  ctx!: CanvasRenderingContext2D;
  
  // Drawing state
  drawing = false;
  color = '#000000';
  size = 5;
  prevX = 0;
  prevY = 0;
  
  // Tools
  activeTool = 'brush'; // 'brush', 'eraser', 'text', 'shape'
  colors: string[] = ['#000000', '#ffffff', '#f44336', '#2196f3', '#4caf50', '#ffeb3b', '#ff9800', '#9c27b0'];
  
  // UI state
  showChat = false;
  isMobileView = false;
  
  // Meeting info
  meetingId!: string;
  meetingCode = '';
  meetingName = '';
  
  // Chat
  chatMsg = '';
  chatLog: ChatMessage[] = [];
  
  private destroy$ = new Subject<void>();
  
  constructor(
    private route: ActivatedRoute, 
    private socket: SocketService,
    private meetingService: MeetingService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit() {
    this.meetingId = this.route.snapshot.paramMap.get('id')!;
    this.setupCanvas();
    this.connectSocket();
    this.checkScreenSize();
    this.getMeetingInfo();
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
    
    // Set canvas size to fill container
    this.resizeCanvas();
    
    // Set default styles
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
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
      this.chatLog.push({
        ...msg,
        timestamp: new Date()
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
        console.error('Error fetching meeting info:', error);
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
    
    // Send data to other clients
    const drawData: DrawData = {
      x: x,
      y: y,
      prevX: this.prevX,
      prevY: this.prevY,
      color: this.activeTool === 'eraser' ? '#FFFFFF' : this.color,
      size: this.activeTool === 'eraser' ? this.size * 2 : this.size,
      type: 'line'
    };
    
    this.socket.sendSignal(this.meetingId, drawData);
    
    // Update previous position
    this.prevX = x;
    this.prevY = y;
  }
  
  endDraw() {
    this.drawing = false;
  }
  
  drawRemote(data: DrawData) {
    // Handle different draw types if we implement them (line, circle, rect, etc)
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
    this.toastr.warning('Are you sure you want to clear the whiteboard?', 'Confirm Clear', {
      timeOut: 5000,
      closeButton: true,
      progressBar: true
    }).onTap.subscribe(() => {
      this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
      // Notify others about clear
      this.socket.sendSignal(this.meetingId, { type: 'clear' });
      this.toastr.info('Whiteboard cleared', 'Cleared');
    });
  }
  
  toggleChat() {
    this.showChat = !this.showChat;
  }
  
  sendChat() {
    if (!this.chatMsg.trim()) return;
    
    this.socket.sendChat(this.chatMsg);
    this.chatLog.push({ 
      user: 'Me', 
      message: this.chatMsg,
      timestamp: new Date()
    });
    this.chatMsg = '';
  }
  
  leaveMeeting() {
    this.toastr.warning('Are you sure you want to leave this meeting?', 'Confirm Leave', {
      timeOut: 5000,
      closeButton: true,
      progressBar: true
    }).onTap.subscribe(() => {
      this.router.navigate(['/meetings']);
    });
  }
  
  copyMeetingCode() {
    navigator.clipboard.writeText(this.meetingCode);
    this.toastr.success(`Code copied: ${this.meetingCode}`, 'Meeting Code', {
      timeOut: 2000
    });
  }
}
