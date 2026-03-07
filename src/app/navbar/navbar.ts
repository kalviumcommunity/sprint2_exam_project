import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {
  isLoggedIn: boolean = false;
  userName: string = '';
  showNavbar: boolean = false;

  constructor(private router: Router) {}

  ngOnInit() {
    this.checkLoginStatus();
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.checkLoginStatus();
    });
  }

  checkLoginStatus() {
    const currentUser = localStorage.getItem('currentUser');
    const currentRoute = this.router.url;
    
    if (currentUser) {
      this.isLoggedIn = true;
      this.userName = JSON.parse(currentUser).name;
    } else {
      this.isLoggedIn = false;
      this.userName = '';
    }
    
    // Hide navbar on login and register pages
    this.showNavbar = currentRoute !== '/' && currentRoute !== '/register';
  }

  logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('examResult');
    this.isLoggedIn = false;
    this.router.navigate(['/']);
  }
}
