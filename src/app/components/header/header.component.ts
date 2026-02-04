import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged, map, of, switchMap } from 'rxjs';
import { ThemeService } from '../../core/services/theme.service';
import { ApiUser, ReqresService } from '../../core/services/reqres.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  private readonly reqres = inject(ReqresService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly search$ = new Subject<string>();

  protected readonly theme = inject(ThemeService);
  protected readonly results = signal<ApiUser[]>([]);
  protected readonly isSearching = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly showPanel = signal(false);

  protected query = '';
  private allUsers: ApiUser[] = [];

  constructor() {
    this.reqres
      .getAllUsers()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((users) => {
        this.allUsers = users;
      });
    this.search$
      .pipe(
        map((value) => value.trim()),
        debounceTime(250),
        distinctUntilChanged(),
        switchMap((value) => {
          if (!value) {
            this.results.set([]);
            this.error.set(null);
            this.isSearching.set(false);
            return of(null);
          }

          this.isSearching.set(true);
          this.error.set(null);
          return of(value);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((value) => {
        if (!value) {
          return;
        }
        const matches = this.allUsers.filter((user) =>
          String(user.id).includes(String(value))
        );
        this.results.set(matches);
        this.error.set(matches.length ? null : 'User not found');
        this.isSearching.set(false);
      });
  }

  protected onQueryChange(value: string) {
    this.query = value;
    this.showPanel.set(Boolean(value.trim()));
    this.search$.next(value);
  }

  protected openPanel() {
    if (this.query.trim() || this.results().length) {
      this.showPanel.set(true);
    }
  }

  protected onSubmit() {
    const value = this.query.trim();
    if (!value) {
      this.showPanel.set(false);
      return;
    }
    this.showPanel.set(true);
    this.search$.next(value);
  }

  protected goToUser(user: ApiUser) {
    this.router.navigate(['/users', user.id]);
    this.query = '';
    this.showPanel.set(false);
    this.results.set([]);
    this.error.set(null);
    this.search$.next('');
  }

  
}
