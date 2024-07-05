import {Component, inject} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {animate, style, transition, trigger} from '@angular/animations';
import {AuthStore, VegetableStore} from '@state';
import {ToasterComponent} from '@ui/toaster';
import {Status} from '@shared/models';
import {EventNotificationService} from './services/event-notification.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToasterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  animations: [
    trigger('jumpIn', [
      transition(':enter', [
        style({opacity: 0, transform: 'translateX(-100%)'}),
        animate(
          '100ms cubic-bezier(0.0, 0.0, 0.2, 1)',
          style({opacity: 1, transform: 'translateX(0)'}),
        ),
      ]),
      transition(':leave', [
        animate(
          '100ms cubic-bezier(0.4, 0.0, 1, 1)',
          style({opacity: 0, transform: 'translateX(-100%)'}),
        ),
      ]),
    ]),
  ],
})
export class AppComponent {
  protected readonly vegetableStore = inject(VegetableStore);
  protected readonly authStore = inject(AuthStore);
  protected readonly eventNotificationService = inject(
    EventNotificationService,
  );

  Status = Status;

  constructor() {
    this.vegetableStore.loadAll();
    this.authStore.getSavedUser();
  }

  swapUser() {
    if (this.authStore.isLoggedIn()) {
      this.authStore.logout();
    } else {
      this.authStore.login();
    }
  }

  onReload() {
    this.vegetableStore.loadAll();
  }
}
