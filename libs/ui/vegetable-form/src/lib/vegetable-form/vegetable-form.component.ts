import {
  Component,
  effect,
  input,
  InputSignal,
  OnInit,
  output,
  OutputEmitterRef,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import {Status, Vegetable} from '@shared/models';

@Component({
  selector: 'lib-vegetable-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './vegetable-form.component.html',
  styleUrl: './vegetable-form.component.css',
})
export class VegetableFormComponent implements OnInit {
  readonly vegetable: InputSignal<Vegetable | undefined> = input<Vegetable>();
  readonly status: InputSignal<Status> = input.required<Status>();
  readonly save: OutputEmitterRef<Vegetable> = output<Vegetable>();
  readonly clearStatus: OutputEmitterRef<void> = output<void>();

  protected readonly MAX_NAME_LENGTH = 14;
  protected readonly MAX_DESCRIPTION_LENGTH = 108;

  Status = Status;

  form = this.#createNewForm();
  name = this.form.get('name') as FormControl<string | null>;
  description = this.form.get('description') as FormControl<string | null>;

  constructor() {
    this.clearStatus.emit();

    this.#disableFormWhenProcessing();
    this.#markUntouchedWhenDone();
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
      const status = this.status();
      if (status === Status.Idle) {
        this.form.markAsUntouched();
      }
    });
  }

  #disableFormWhenProcessing() {
    effect(() => {
      if (this.status() !== Status.Idle) {
        this.form.disable();
      } else {
        this.form.enable();
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
    this.save.emit(editedVegetable);
  }
}
