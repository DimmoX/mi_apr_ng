import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-action-button',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './action-button.component.html',
  styleUrls: ['./action-button.component.scss']
})
export class ActionButtonComponent {
  @Input() text: string = '';
  @Input() icon?: string;
  @Input() color: 'primary' | 'accent' | 'warn' | 'basic' = 'primary';
  @Input() variant: 'raised' | 'flat' | 'stroked' | 'fab' | 'mini-fab' | 'icon' = 'raised';
  @Input() disabled: boolean = false;
  @Input() loading: boolean = false;
  @Input() fullWidth: boolean = false;
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Output() clicked = new EventEmitter<void>();
  onClick(): void {
    if (!this.disabled && !this.loading) {
      this.clicked.emit();
    }
  }
}
