import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  name = '';
  email = 'demo@example.com';
  password = 'password';
  loading = false;
  error = '';

  constructor(
    private readonly auth: AuthService,
    private readonly router: Router
  ) {}

  login(): void {
    this.loading = true;
    this.error = '';
    this.auth.login(this.email, this.password).subscribe({
      next: () => {
        this.loading = false;
        void this.router.navigate(['/']);
      },
      error: () => {
        this.loading = false;
        this.error = 'Login failed. Creating account and retrying...';
        this.registerThenLogin();
      }
    });
  }

  private registerThenLogin(): void {
    const name = this.name.trim() || this.email.split('@')[0];
    this.auth.register(name, this.email, this.password).subscribe({
      next: () => {
        this.auth.login(this.email, this.password).subscribe({
          next: () => void this.router.navigate(['/']),
          error: () => (this.error = 'Unable to authenticate')
        });
      },
      error: () => {
        this.error = 'Unable to register user';
      }
    });
  }
}
