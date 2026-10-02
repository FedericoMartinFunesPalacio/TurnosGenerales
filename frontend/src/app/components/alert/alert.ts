import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert.html',
  styleUrls: ['./alert.css'],
})
export class AlertComponent {
  @Input() type: 'success' | 'error' | 'warning' | 'info' = 'info';
  @Input() message = '';
}
