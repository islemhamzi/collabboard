import { Routes } from '@angular/router';
import { UserBoard } from './boards/user-board/user-board';
import { AdminBoard } from './boards/admin-board/admin-board';
import { LoginComponent } from './components/login/login';

import { authGuard } from './guards/auth-guard';


export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { 
    path: 'boards/user', 
    component: UserBoard, 
    canActivate: [authGuard],
    data: { roles: ['ROLE_USER'] }
  },
  { 
    path: 'boards/admin', 
    component: AdminBoard, 
    canActivate: [authGuard],
    data: { roles: ['ROLE_ADMIN'] }
  },
  { path: '**', redirectTo: 'login' } // fallback route
];
