// src/app/components/login/login.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    console.log('Login clicked', this.username, this.password);

    this.authService.login({ username: this.username, password: this.password })
      .subscribe({
        next: () => {
          console.log('Login success');

          const roles = this.authService.getRoles();
          console.log('Roles after login:', roles);

          if (roles.includes('ROLE_ADMIN')) {
            this.router.navigate(['/boards/admin']);
          } else if (roles.includes('ROLE_USER')) {
            this.router.navigate(['/boards/user']);
          } else {
            this.router.navigate(['/']); // fallback
          }
        },
        error: err => {
          console.error('Login error', err);
          this.errorMessage = 'Invalid username or password';
        }
      });
  }
}
