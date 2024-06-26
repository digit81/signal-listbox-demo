import {
  Component,
  effect,
  inject,
  input,
  InputSignal,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { VegetableStore } from '@state';
import { Status, Vegetable } from '@shared/models';

@Component({
  selector: 'lib-vegetable-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './vegetable-form.component.html',
  styleUrl: './vegetable-form.component.css',
})
export class VegetableFormComponent implements OnInit {
  protected readonly vegetableStore = inject(VegetableStore);
  private readonly router: Router = inject(Router);

  readonly vegetable: InputSignal<Vegetable | undefined> = input<Vegetable>();

  protected readonly MAX_NAME_LENGTH = 14;
  protected readonly MAX_DESCRIPTION_LENGTH = 108;

  Status = Status;

  form = this.#createNewForm();
  name = this.form.get('name') as FormControl<string | null>;
  description = this.form.get('description') as FormControl<string | null>;

  constructor() {
    this.vegetableStore.resetSave();

    this.#disableFormWhenProcessing();
    this.#markUntouchedWhenDone();
    this.#returnToEditorOnSuccess();
  }

  ngOnInit(): void {
    this.#setInitialValues();
  }

  #setInitialValues() {
    const v = this.vegetable();
    if (v) {
      this.form.setValue({
        name: v.name,
        description: v.description,
        id: v.id,
      });
    }
  }

  #markUntouchedWhenDone() {
    effect(() => {
      const status = this.vegetableStore.saveStatus();
      if (status === Status.Idle) {
        this.form.markAsUntouched();
      }
    });
  }

  #disableFormWhenProcessing() {
    effect(() => {
      if (this.vegetableStore.saveStatus() !== Status.Idle) {
        this.form.disable();
      } else {
        this.form.enable();
      }
    });
  }

  #returnToEditorOnSuccess() {
    effect(() => {
      const status = this.vegetableStore.saveStatus();
      const router = this.router;
      if (status === Status.Success && !this.vegetable()) {
        setTimeout(() => router.navigate(['/edit']), 1500);
      }
    });
  }

  #createNewForm(v?: Vegetable): FormGroup<{
    id: FormControl<number | null>;
    name: FormControl<string | null>;
    description: FormControl<string | null>;
  }> {
    return new FormGroup({
      id: new FormControl(v?.id || null),
      name: new FormControl(v?.name || null, [
        Validators.required,
        Validators.maxLength(this.MAX_NAME_LENGTH),
      ]),
      description: new FormControl(v?.description || null, [
        Validators.required,
        Validators.maxLength(this.MAX_DESCRIPTION_LENGTH),
      ]),
    });
  }

  onSave() {
    const editedVegetable = this.form.value as Vegetable;
    this.vegetableStore.save(editedVegetable);
  }
}
