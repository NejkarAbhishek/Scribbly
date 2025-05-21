// src/app/pages/landing/landing.component.ts
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  LucideAngularModule,
  BrainCircuit,
  ArrowRight,
  Lightbulb,
  MessageSquare,
  Users,
} from 'lucide-angular';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    RouterModule
  ],
  templateUrl: './landing.component.html',
})
export class LandingPageComponent {
  currentYear = new Date().getFullYear();
}
