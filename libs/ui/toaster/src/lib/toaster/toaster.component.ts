import {Component, input, output, OutputEmitterRef} from '@angular/core';
import {toObservable, toSignal} from '@angular/core/rxjs-interop';
import {animate, style, transition, trigger} from '@angular/animations';

import {
  mergeMap,
  timer,
  map,
  take,
  scan,
  pipe,
  filter,
  OperatorFunction,
} from 'rxjs';

import {Toast} from '../models';

@Component({
  selector: 'lib-toaster',
  standalone: true,
  imports: [],
  templateUrl: './toaster.component.html',
  styleUrl: './toaster.component.css',
  animations: [
    trigger('animation', [
      transition(':enter', [
        style({opacity: 0, transform: 'translateX(100%)'}),
        animate(
          '250ms cubic-bezier(0.0, 0.0, 0.2, 1)',
          style({opacity: 1, transform: 'translateX(0)'}),
        ),
      ]),
      transition(':leave', [
        animate(
          '200ms cubic-bezier(0.4, 0.0, 1, 1)',
          style({opacity: 0, transform: 'translateX(100%)'}),
        ),
      ]),
    ]),
  ],
})
export class ToasterComponent {
  readonly reload: OutputEmitterRef<void> = output<void>();
  readonly hasLoadingError = input.required<boolean>();
  readonly newToast = input<Toast>();
  readonly displayDuration = input<number>();

  protected readonly activeToasts = toSignal(
    toObservable(this.newToast).pipe(
      filter((x) => !!x) as OperatorFunction<Toast | undefined, Toast>,
      this.#pullIntoArrayFor(this.displayDuration() || 3000),
    ),
  );

  #pullIntoArrayFor(displayFor: number) {
    return pipe(
      mergeMap((toast: Toast) =>
        timer(0, displayFor).pipe(
          take(2),
          map((isDeferred) => ({remove: !!isDeferred, toast})),
        ),
      ),
      scan(
        (toasts, newToast) =>
          newToast.remove
            ? this.#getArrayWithoutItem(toasts, newToast.toast)
            : [newToast.toast, ...toasts],
        <Toast[]>[],
      ),
    );
  }

  #getArrayWithoutItem<A>(array: A[], item: A) {
    const index = array.indexOf(item);
    if (index > -1) {
      array.splice(index, 1);
      return [...array];
    }
    return array;
  }

  reloadAll() {
    this.reload.emit();
  }
}
