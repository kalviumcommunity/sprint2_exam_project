import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  userName: string = '';
  exams = [
    {
      id: 1,
      title: 'JavaScript Fundamentals',
      description: 'Test your knowledge of JavaScript basics including variables, functions, and DOM manipulation.',
      duration: 10,
      questions: 5,
      difficulty: 'Beginner'
    },
    {
      id: 2,
      title: 'Angular Framework',
      description: 'Comprehensive exam covering Angular components, services, routing, and best practices.',
      duration: 15,
      questions: 5,
      difficulty: 'Intermediate'
    },
    {
      id: 3,
      title: 'Web Development',
      description: 'Full-stack web development concepts including HTML, CSS, and modern frameworks.',
      duration: 20,
      questions: 5,
      difficulty: 'Advanced'
    }
  ];

  constructor(private router: Router) {}

  ngOnInit() {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
      this.router.navigate(['/']);
      return;
    }
    this.userName = JSON.parse(currentUser).name;
  }

  startExam(exam: any) {
    localStorage.setItem('currentExam', JSON.stringify(exam));
    this.router.navigate(['/exam']);
  }
}
