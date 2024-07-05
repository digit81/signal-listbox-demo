import {Component, computed, effect, inject} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {VegetableFormComponent} from '@ui/vegetable-form';
import {Status} from '@shared/models';
import {VegetableStore} from '@state';

@Component({
  selector: 'app-vegetable-vegetable-edit-view-view',
  standalone: true,
  imports: [RouterLink, VegetableFormComponent],
  templateUrl: './vegetable-edit-view.component.html',
  styleUrl: './vegetable-edit-view.component.css',
})
export class VegetableEditViewComponent {
  protected readonly vegetableStore: VegetableStore = inject(VegetableStore);
  private readonly route = inject(ActivatedRoute);
  private readonly router: Router = inject(Router);

  Status = Status;

  constructor() {
    this.#returnToEditorOnSuccess();
  }

  protected readonly activeVegetable = computed(() => {
    const id = this.route.snapshot.paramMap.get('id');
    return this.vegetableStore.vegetables().find((v) => v.id === Number(id));
  });

  #returnToEditorOnSuccess() {
    effect(() => {
      const status = this.vegetableStore.saveStatus();
      const router = this.router;
      if (status === Status.Success && !this.activeVegetable()) {
        setTimeout(() => router.navigate(['/edit']), 1500);
      }
    });
  }
}
