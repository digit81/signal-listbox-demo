import { Component, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Listbox, Option, Orientation } from './listbox';
import { Vegetable, VegetablesService } from './vegetables.service';
import { CardComponent } from './card/card.component';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { trigger, style, animate, transition } from '@angular/animations';

// TODO: create service that talks directly to API to handle application state
// TODO: add signalstore to hold app state and talk to the data service

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Listbox, Option, CardComponent, JsonPipe, AsyncPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  animations: [
    trigger('myInsertRemoveTrigger', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('250ms cubic-bezier(0.0, 0.0, 0.2, 1)', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('200ms cubic-bezier(0.4, 0.0, 1, 1)', style({ opacity: 0 })),
      ]),
    ]),
    trigger('offsetEnter', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate(
          '250ms 250ms cubic-bezier(0.0, 0.0, 0.2, 1)',
          style({ opacity: 1 })
        ),
      ]),
    ]),
  ],
})
export class AppComponent {
  title = 'try-signals';

  private readonly URL_IDS_PARAM = 'ids';

  private vegetableService = inject(VegetablesService);
  protected readonly availableVegetables$ =
    this.vegetableService.getVegetables();
  protected selectedToppings: Vegetable[] = [];

  private router = inject(Router);

  protected orientation = signal<Orientation>(Orientation.Vertical);

  constructor() {
    const searchParams = new URLSearchParams(window.location.search);
    const currentIds = searchParams.get(this.URL_IDS_PARAM)?.split(',') ?? [];

    // this.selectedToppings = this.availableVegetables$.filter((v) =>
    //   currentIds.includes(v.id.toString())
    // );
  }

  updateQueryParams(newSelection: Vegetable[]) {
    const newIds = newSelection.map((vegetable) => vegetable.id).join(',');
    const queryParams = { [this.URL_IDS_PARAM]: newIds };
    this.router.navigate([], {
      queryParams,
      replaceUrl: true,
    });
  }

  logOrientationChange(newOrientation: Orientation) {
    console.log(newOrientation);
  }

  toggleOrientation() {
    this.orientation.update((oldValue) =>
      oldValue === Orientation.Horizontal
        ? Orientation.Vertical
        : Orientation.Horizontal
    );
  }
}
