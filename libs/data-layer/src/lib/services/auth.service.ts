import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { User } from '@shared/models';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  readonly #USERS_URL = 'http://localhost:3000/users';
  readonly #http = inject(HttpClient);

  getUser() {
    const id = Math.floor(Math.random() * 3) + 1;
    return this.#http.get<User>(this.#USERS_URL + '/' + id);
  }
}
