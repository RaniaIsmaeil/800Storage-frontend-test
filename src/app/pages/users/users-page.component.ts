import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

type ApiUser = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
};

type UsersResponse = {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  data: ApiUser[];
};

@Component({
  selector: 'app-users-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './users-page.component.html',
  styleUrl: './users-page.component.scss'
})
export class UsersPageComponent {
  private readonly http = inject(HttpClient);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly users = signal<ApiUser[]>([]);
  protected readonly page = signal(1);
  protected readonly totalPages = signal(1);
  protected readonly isLoading = signal(false);
  protected readonly error = signal<string | null>(null);

  constructor() {
    const pageParam = Number(this.route.snapshot.queryParamMap.get('page'));
    const initialPage = pageParam && !Number.isNaN(pageParam) ? pageParam : 1;
    this.loadPage(initialPage);
  }

  protected loadPage(page: number) {
    if (page < 1) {
      return;
    }

    this.isLoading.set(true);
    this.error.set(null);
    this.http.get<UsersResponse>(`https://reqres.in/api/users?page=${page}`).subscribe({
      next: (response) => {
        this.users.set(response.data);
        this.page.set(response.page);
        this.totalPages.set(response.total_pages);
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { page: response.page },
          queryParamsHandling: 'merge'
        });
        this.isLoading.set(false);
      },
      error: () => {
        this.error.set('Unable to load users. Please try again.');
        this.isLoading.set(false);
      }
    });
  }

  protected prevPage() {
    this.loadPage(this.page() - 1);
  }

  protected nextPage() {
    this.loadPage(this.page() + 1);
  }
}
