import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { map, of, switchMap } from 'rxjs';

type ApiUser = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
};

type UserResponse = {
  data: ApiUser;
};

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.scss'
})
export class UserDetailsComponent {
  private readonly http = inject(HttpClient);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly user = signal<ApiUser | null>(null);
  protected readonly isLoading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly backQuery = signal<{ page?: number }>({});

  constructor() {
    this.route.queryParamMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        const pageParam = Number(params.get('page'));
        this.backQuery.set(
          pageParam && !Number.isNaN(pageParam) ? { page: pageParam } : {}
        );
      });

    this.route.paramMap
      .pipe(
        map((params) => Number(params.get('id'))),
        switchMap((id) => {
          if (!id || Number.isNaN(id)) {
            this.user.set(null);
            this.isLoading.set(false);
            this.error.set('Invalid user id.');
            return of(null);
          }
          this.isLoading.set(true);
          this.error.set(null);
          return this.http.get<UserResponse>(`https://reqres.in/api/users/${id}`);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (response) => {
          if (!response) {
            return;
          }
          this.user.set(response.data);
          this.isLoading.set(false);
        },
        error: () => {
          this.error.set('Unable to load user details.');
          this.isLoading.set(false);
        }
      });
  }
}
