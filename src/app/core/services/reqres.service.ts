import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map, shareReplay, switchMap } from 'rxjs';

export type ApiUser = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
};

export type UsersResponse = {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  data: ApiUser[];
};

export type UserResponse = {
  data: ApiUser;
};

@Injectable({ providedIn: 'root' })
export class ReqresService {
  private readonly cache = new Map<string, Observable<unknown>>();

  constructor(private readonly http: HttpClient) {}

  getUsersPage(page: number): Observable<UsersResponse> {
    return this.getCached<UsersResponse>(`users-page-${page}`, () =>
      this.http.get<UsersResponse>(`https://reqres.in/api/users?page=${page}`)
    );
  }

  getUser(id: number | string): Observable<ApiUser> {
    return this.getCached<UserResponse>(`user-${id}`, () =>
      this.http.get<UserResponse>(`https://reqres.in/api/users/${id}`)
    ).pipe(map((response) => response.data));
  }

  getAllUsers(): Observable<ApiUser[]> {
    return this.getCached<ApiUser[]>(`users-all`, () =>
      this.http.get<UsersResponse>(`https://reqres.in/api/users?page=1`).pipe(
        map((first) => first.total_pages),
        map((totalPages) => Array.from({ length: totalPages }, (_, idx) => idx + 1)),
        switchMap((pages) => forkJoin(pages.map((page) => this.getUsersPage(page)))),
        map((responses) => responses.flatMap((response) => response.data))
      )
    );
  }

  private getCached<T>(key: string, loader: () => Observable<T>): Observable<T> {
    const cached = this.cache.get(key) as Observable<T> | undefined;
    if (cached) {
      return cached;
    }
    const request$ = loader().pipe(shareReplay(1));
    this.cache.set(key, request$);
    return request$;
  }
}
