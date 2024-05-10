import { Component, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { Listbox, Option, Orientation } from './listbox';
import { Vegetable, VegetablesService } from './vegetables.service';
import { CardComponent } from './card/card.component';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Listbox, Option, CardComponent, JsonPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'try-signals';

  private vegetableService = inject(VegetablesService);
  protected readonly availableVegetables =
    this.vegetableService.getVegetables();
  protected selectedToppings: Vegetable[] = [];

  private route = inject(ActivatedRoute);
  private router = inject(Router);

  protected orientation = signal<Orientation>('vertical');

  constructor() {
    this.route.queryParamMap.subscribe((queryParams) => {
      const currentIds = queryParams.getAll('ids');

      let selectionFromQuery: Vegetable[] = [];
      for (const id of currentIds) {
        const matchedVegetable = this.availableVegetables.find(
          (vegetable) => vegetable.id === Number(id)
        );
        if (matchedVegetable) {
          selectionFromQuery.push(matchedVegetable);
        }
      }

      this.selectedToppings = selectionFromQuery;
    });
  }

  updateQueryParams(newSelection: Vegetable[]) {
    const newIds = newSelection.map((vegetable) => vegetable.id);

    this.router.navigate([], {
      queryParams: {
        ids: newIds,
      },
    });
  }

  logOrientationChange(newOrientation: Orientation) {
    console.log(newOrientation);
  }

  toggleOrientation() {
    this.orientation.update((oldValue) =>
      oldValue === 'horizontal' ? 'vertical' : 'horizontal'
    );
  }
}
