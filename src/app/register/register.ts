import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  name: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private router: Router) {}

  onRegister() {
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters';
      return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const existingUser = users.find((u: any) => u.email === this.email);

    if (existingUser) {
      this.errorMessage = 'Email already registered';
      return;
    }

    users.push({ name: this.name, email: this.email, password: this.password });
    localStorage.setItem('users', JSON.stringify(users));
    
    this.successMessage = 'Registration successful! Redirecting to login...';
    this.errorMessage = '';
    
    setTimeout(() => {
      this.router.navigate(['/']);
    }, 2000);
  }
}
