import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list.html',
  styleUrls: ['./list.css'],
})
export class ListComponent {
  @Input() emptyMessage = 'No hay elementos para mostrar';
  @Input() items: any[] = [];
}
