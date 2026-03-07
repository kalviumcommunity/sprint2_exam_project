import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

interface QuestionResult {
  question: string;
  options: string[];
  userAnswer: number;
  correctAnswer: number;
  isCorrect: boolean;
}

@Component({
  selector: 'app-result',
  imports: [CommonModule],
  templateUrl: './result.html',
  styleUrl: './result.css',
})
export class Result implements OnInit {
  examTitle: string = '';
  totalQuestions: number = 0;
  correctAnswers: number = 0;
  percentage: number = 0;
  timeTaken: string = '';
  grade: string = '';
  gradeClass: string = '';
  questionResults: QuestionResult[] = [];
  showReview: boolean = false;

  constructor(private router: Router) {}

  ngOnInit() {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
      this.router.navigate(['/']);
      return;
    }

    const result = localStorage.getItem('examResult');
    if (result) {
      const data = JSON.parse(result);
      this.examTitle = data.examTitle;
      this.totalQuestions = data.totalQuestions;
      this.correctAnswers = data.correctAnswers;
      this.percentage = data.percentage;
      this.timeTaken = data.timeTaken;
      this.questionResults = data.questionResults || [];
      this.calculateGrade();
    } else {
      this.router.navigate(['/dashboard']);
    }
  }

  calculateGrade() {
    if (this.percentage >= 90) {
      this.grade = 'A+';
      this.gradeClass = 'grade-a';
    } else if (this.percentage >= 80) {
      this.grade = 'A';
      this.gradeClass = 'grade-a';
    } else if (this.percentage >= 70) {
      this.grade = 'B';
      this.gradeClass = 'grade-b';
    } else if (this.percentage >= 60) {
      this.grade = 'C';
      this.gradeClass = 'grade-c';
    } else if (this.percentage >= 50) {
      this.grade = 'D';
      this.gradeClass = 'grade-d';
    } else {
      this.grade = 'F';
      this.gradeClass = 'grade-f';
    }
  }

  toggleReview() {
    this.showReview = !this.showReview;
  }

  goToDashboard() {
    localStorage.removeItem('examResult');
    this.router.navigate(['/dashboard']);
  }
}
