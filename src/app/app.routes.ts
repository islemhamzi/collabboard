import { Routes } from '@angular/router';
import { UserBoardComponent } from './boards/user-board/user-board';
import { AdminBoardComponent } from './boards/admin-board/admin-board';
import { LoginComponent } from './components/login/login';

import { authGuard } from './guards/auth-guard';


export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { 
    path: 'boards/user', 
    component: UserBoardComponent, 
    canActivate: [authGuard],
    data: { roles: ['ROLE_USER'] }
  },
  { 
    path: 'boards/admin', 
    component: AdminBoardComponent, 
    canActivate: [authGuard],
    data: { roles: ['ROLE_ADMIN'] }
  },
  { path: '**', redirectTo: 'login' } // fallback route
];
