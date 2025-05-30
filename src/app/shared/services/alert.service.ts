import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface AlertMessage {
  type: 'success' | 'error' | 'info';
  message: string;
}

@Injectable({ providedIn: 'root' })
export class AlertService {
  private alertSubject = new Subject<AlertMessage>();
  alert$ = this.alertSubject.asObservable();

  show(type: AlertMessage['type'], message: string): void {
    this.alertSubject.next({ type, message });
  }
}
