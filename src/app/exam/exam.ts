import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

@Component({
  selector: 'app-exam',
  imports: [CommonModule, FormsModule],
  templateUrl: './exam.html',
  styleUrl: './exam.css',
})
export class Exam implements OnInit, OnDestroy {
  examTitle: string = '';
  currentQuestionIndex: number = 0;
  selectedAnswers: number[] = [];
  timeRemaining: number = 0;
  timerInterval: any;
  isSubmitted: boolean = false;

  questions: Question[] = [
    {
      id: 1,
      question: 'What does HTML stand for?',
      options: [
        'Hyper Text Markup Language',
        'Home Tool Markup Language',
        'Hyperlinks and Text Markup Language',
        'Hyperlinking Text Marking Language'
      ],
      correctAnswer: 0
    },
    {
      id: 2,
      question: 'Which of the following is a JavaScript framework?',
      options: ['Django', 'Angular', 'Flask', 'Laravel'],
      correctAnswer: 1
    },
    {
      id: 3,
      question: 'What is the correct syntax to declare a variable in JavaScript?',
      options: ['variable x;', 'var x;', 'v x;', 'declare x;'],
      correctAnswer: 1
    },
    {
      id: 4,
      question: 'Which CSS property is used to change the text color?',
      options: ['font-color', 'text-color', 'color', 'foreground-color'],
      correctAnswer: 2
    },
    {
      id: 5,
      question: 'What does CSS stand for?',
      options: [
        'Creative Style Sheets',
        'Cascading Style Sheets',
        'Computer Style Sheets',
        'Colorful Style Sheets'
      ],
      correctAnswer: 1
    }
  ];

  constructor(private router: Router) {}

  ngOnInit() {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
      this.router.navigate(['/']);
      return;
    }

    const currentExam = localStorage.getItem('currentExam');
    if (currentExam) {
      const exam = JSON.parse(currentExam);
      this.examTitle = exam.title;
      this.timeRemaining = exam.duration * 60; // Convert minutes to seconds
    } else {
      this.timeRemaining = 10 * 60; // Default 10 minutes
      this.examTitle = 'General Knowledge Exam';
    }

    this.selectedAnswers = new Array(this.questions.length).fill(-1);
    this.startTimer();
  }

  ngOnDestroy() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  startTimer() {
    this.timerInterval = setInterval(() => {
      if (this.timeRemaining > 0) {
        this.timeRemaining--;
      } else {
        this.autoSubmit();
      }
    }, 1000);
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  selectAnswer(questionIndex: number, optionIndex: number) {
    this.selectedAnswers[questionIndex] = optionIndex;
  }

  nextQuestion() {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
    }
  }

  previousQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
    }
  }

  goToQuestion(index: number) {
    this.currentQuestionIndex = index;
  }

  autoSubmit() {
    clearInterval(this.timerInterval);
    this.submitExam();
  }

  submitExam() {
    if (this.isSubmitted) return;
    
    this.isSubmitted = true;
    clearInterval(this.timerInterval);

    let score = 0;
    this.questions.forEach((q, index) => {
      if (this.selectedAnswers[index] === q.correctAnswer) {
        score++;
      }
    });

    const result = {
      examTitle: this.examTitle,
      totalQuestions: this.questions.length,
      correctAnswers: score,
      percentage: Math.round((score / this.questions.length) * 100),
      timeTaken: this.formatTime((localStorage.getItem('currentExam') ? JSON.parse(localStorage.getItem('currentExam')!).duration * 60 : 600) - this.timeRemaining)
    };

    localStorage.setItem('examResult', JSON.stringify(result));
    localStorage.removeItem('currentExam');
    this.router.navigate(['/result']);
  }

  get answeredCount(): number {
    return this.selectedAnswers.filter(a => a !== -1).length;
  }
}
