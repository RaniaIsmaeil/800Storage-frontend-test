import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, RouterModule } from '@angular/router';

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

  protected readonly user = signal<ApiUser | null>(null);
  protected readonly isLoading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly backQuery = signal<{ page?: number }>({});

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const pageParam = Number(this.route.snapshot.queryParamMap.get('page'));
    if (pageParam && !Number.isNaN(pageParam)) {
      this.backQuery.set({ page: pageParam });
    }
    if (!id || Number.isNaN(id)) {
      this.isLoading.set(false);
      this.error.set('Invalid user id.');
      return;
    }

    this.http.get<UserResponse>(`https://reqres.in/api/users/${id}`).subscribe({
      next: (response) => {
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
