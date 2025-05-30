import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AlertMessage, AlertService } from '../../services/alert.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.css',
})
export class AlertComponent implements OnInit, OnDestroy {
  message: AlertMessage | null = null;
  private sub!: Subscription;
  private timeoutId?: any;

  private alertService = inject(AlertService);

  ngOnInit(): void {
    this.sub = this.alertService.alert$.subscribe((msg) => {
      this.message = msg;
      clearTimeout(this.timeoutId);
      this.timeoutId = setTimeout(() => (this.message = null), 5000);
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
    clearTimeout(this.timeoutId);
  }
}
