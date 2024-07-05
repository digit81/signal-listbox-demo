import {Injectable, Signal, inject} from '@angular/core';
import {toObservable, toSignal} from '@angular/core/rxjs-interop';

import {filter, map, merge, pipe} from 'rxjs';

import {AuthStore} from '@state';
import {VegetableStore} from '@state';

import {Status} from '@shared/models';
import {FreeToast, Toast} from 'libs/ui/toaster/src/lib/models';

@Injectable({
  providedIn: 'root',
})
export class EventNotificationService {
  readonly #authStore = inject(AuthStore);
  readonly #vegetableStore = inject(VegetableStore);

  readonly #authEvents$ = toObservable(this.#authStore.status).pipe(
    this.#extractErrorSuccessToFreeToast(this.#authStore.message),
  );

  readonly #vegetableEvents$ = toObservable(
    this.#vegetableStore.saveStatus,
  ).pipe(this.#extractErrorSuccessToFreeToast(this.#vegetableStore.message));

  readonly latestEvent = toSignal(
    merge(this.#authEvents$, this.#vegetableEvents$).pipe(this.#addIdToToast()),
  );

  #extractErrorSuccessToFreeToast(message: Signal<string>) {
    return pipe(
      filter((status: Status) =>
        [Status.Error, Status.Success].includes(status),
      ),
      map(
        (status: Status): FreeToast => ({
          message: message(),
          type: status === Status.Error ? 'error' : 'success',
        }),
      ),
    );
  }

  #addIdToToast() {
    return map((toast: FreeToast, i): Toast => ({...toast, id: i + 1}));
  }
}
