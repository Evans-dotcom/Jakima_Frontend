import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common'; // Import only the directive you need

@Component({
  selector: 'app-status-badge',
  standalone: true, // Required for the 'imports' array below to work
  imports: [NgClass], // Tells the compiler what [ngClass] is
  template: `
    <span class="status-badge" [ngClass]="getStatusClass()">
      {{ status }}
    </span>
  `,
  styles: [`
    .status-badge {
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      display: inline-block;
    }
    .status-pending {
      background-color: #ff9800;
      color: white;
    }
    .status-inprogress {
      background-color: #2196f3;
      color: white;
    }
    .status-completed {
      background-color: #4caf50;
      color: white;
    }
    .status-lagging {
      background-color: #f44336;
      color: white;
    }
    .status-default {
      background-color: #9e9e9e;
      color: white;
    }
  `]
})
export class StatusBadgeComponent {
  @Input() status: string = '';

  getStatusClass(): string {
    const statusLower = this.status ? this.status.toLowerCase() : '';
    
    if (statusLower.includes('pending')) return 'status-pending';
    if (statusLower.includes('inprogress') || statusLower.includes('in progress')) return 'status-inprogress';
    if (statusLower.includes('completed')) return 'status-completed';
    if (statusLower.includes('lagging')) return 'status-lagging';
    
    return 'status-default';
  }
}