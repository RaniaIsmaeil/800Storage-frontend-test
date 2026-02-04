import { Routes } from '@angular/router';
import { UsersPageComponent } from './pages/users/users-page.component';
import { UserDetailsComponent } from './pages/user-details/user-details.component';

export const routes: Routes = [
  { path: '', component: UsersPageComponent },
  { path: 'users/:id', component: UserDetailsComponent }
];
