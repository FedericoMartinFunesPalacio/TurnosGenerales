import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './modal.html',
  styleUrls: ['./modal.css'],
})
export class ModalComponent {
  @Input() open = false;
  @Input() title = '';
  @Input() maxWidth = '500px';
  @Output() closed = new EventEmitter<void>();

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.closed.emit();
    }
  }

  close(): void {
    this.closed.emit();
  }
}
