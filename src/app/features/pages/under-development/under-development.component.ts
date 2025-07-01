import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { PageHeaderComponent } from '../../../components/page-header/page-header.component';
import { ActionButtonComponent } from '../../../components/action-button/action-button.component';
@Component({
  selector: 'app-under-development',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    PageHeaderComponent,
    ActionButtonComponent
  ],
  templateUrl: './under-development.component.html',
  styleUrl: './under-development.component.scss'
})
export class UnderDevelopmentComponent {
  constructor(private router: Router) {}
  goBack(): void {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      this.router.navigate(['/dashboard']);
    }
  }
  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
  goToHome(): void {
    this.router.navigate(['/home']);
  }
  goToContact(): void {
    this.router.navigate(['/contact']);
  }
}
