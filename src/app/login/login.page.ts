import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, AuthRole } from '../services/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage {
  currentRole: AuthRole;

  constructor(private authService: AuthService, private router: Router) {
    this.currentRole = this.authService.getRole();
  }

  login(role: 'user' | 'admin') {
    this.authService.loginAs(role);
    this.router.navigate(['/tabs/home']);
  }

  logout() {
    this.authService.logout();
    this.currentRole = null;
  }
}
