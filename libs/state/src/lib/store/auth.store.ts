import { computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Status, User } from '@shared/models';
import { AuthService } from '@data-layer';
import { tapResponse } from '@ngrx/operators';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';

type AuthState = {
  user: User | undefined;
  status: Status;
  message: string;
};

const initialState: AuthState = {
  user: undefined,
  status: Status.Idle,
  message: '',
};

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ user }) => ({
    isLoggedIn: computed(() => !!user()),
    canEdit: computed(() => user()?.permissions.includes('edit')),
    canCreate: computed(() => user()?.permissions.includes('create')),
  })),
  withMethods(
    (store, authService = inject(AuthService), router = inject(Router)) => ({
      logout(): void {
        patchState(store, {
          user: undefined,
          status: Status.Success,
          message: 'Logged out',
        });
        router.navigate(['/']);
        setTimeout(() => patchState(store, { status: Status.Idle }));
      },
      getSavedUser(): void {
        const token = window.localStorage.getItem('user-token');
        if (token) {
          const user: User = JSON.parse(token);
          if (user.id && user.name && user.permissions) {
            patchState(store, {
              user,
            });
          }
        }
      },
      login: rxMethod<void>(
        pipe(
          tap(() => patchState(store, { status: Status.Loading })),
          switchMap(() =>
            authService.getUser().pipe(
              tap((user) =>
                window.localStorage.setItem('user-token', JSON.stringify(user)),
              ),
              tapResponse({
                next: (user) =>
                  patchState(store, {
                    user,
                    status: Status.Success,
                    message: 'Logged in',
                  }),
                error: () =>
                  patchState(store, {
                    status: Status.Error,
                    message: 'Failed to login',
                  }),
                finalize: () => {
                  setTimeout(() => patchState(store, { status: Status.Idle }));
                },
              }),
            ),
          ),
        ),
      ),
    }),
  ),
);
