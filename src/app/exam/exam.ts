import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
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
  questions: Question[] = [];

  // JavaScript Questions
  jsQuestions: Question[] = [
    {
      id: 1,
      question: 'Which keyword is used to declare a constant in JavaScript?',
      options: ['var', 'let', 'const', 'constant'],
      correctAnswer: 2
    },
    {
      id: 2,
      question: 'What will "typeof null" return in JavaScript?',
      options: ['null', 'undefined', 'object', 'boolean'],
      correctAnswer: 2
    },
    {
      id: 3,
      question: 'Which method adds an element to the end of an array?',
      options: ['push()', 'pop()', 'shift()', 'unshift()'],
      correctAnswer: 0
    },
    {
      id: 4,
      question: 'What is the output of: console.log(2 + "2")?',
      options: ['4', '22', 'NaN', 'Error'],
      correctAnswer: 1
    },
    {
      id: 5,
      question: 'Which symbol is used for single-line comments in JavaScript?',
      options: ['#', '//', '/* */', '--'],
      correctAnswer: 1
    }
  ];

  // Angular Questions
  angularQuestions: Question[] = [
    {
      id: 1,
      question: 'What decorator is used to define a component in Angular?',
      options: ['@NgModule', '@Component', '@Injectable', '@Directive'],
      correctAnswer: 1
    },
    {
      id: 2,
      question: 'Which file contains the root module of an Angular application?',
      options: ['app.component.ts', 'app.module.ts', 'main.ts', 'index.html'],
      correctAnswer: 1
    },
    {
      id: 3,
      question: 'What is used for two-way data binding in Angular?',
      options: ['{{ }}', '[ ]', '( )', '[( )]'],
      correctAnswer: 3
    },
    {
      id: 4,
      question: 'Which directive is used to loop through items in Angular?',
      options: ['*ngIf', '*ngFor', '*ngSwitch', '*ngLoop'],
      correctAnswer: 1
    },
    {
      id: 5,
      question: 'What is the Angular CLI command to create a new component?',
      options: ['ng new component', 'ng generate component', 'ng create component', 'ng add component'],
      correctAnswer: 1
    }
  ];

  // Web Development Questions
  webDevQuestions: Question[] = [
    {
      id: 1,
      question: 'What does HTML stand for?',
      options: ['Hyper Text Markup Language', 'Home Tool Markup Language', 'Hyperlinks Text Mark Language', 'Hyper Tool Multi Language'],
      correctAnswer: 0
    },
    {
      id: 2,
      question: 'Which CSS property is used to change the background color?',
      options: ['color', 'bgcolor', 'background-color', 'bg-color'],
      correctAnswer: 2
    },
    {
      id: 3,
      question: 'What is the correct HTML element for the largest heading?',
      options: ['<heading>', '<h6>', '<head>', '<h1>'],
      correctAnswer: 3
    },
    {
      id: 4,
      question: 'Which protocol is used for secure communication over the internet?',
      options: ['HTTP', 'FTP', 'HTTPS', 'SMTP'],
      correctAnswer: 2
    },
    {
      id: 5,
      question: 'What does CSS stand for?',
      options: ['Creative Style Sheets', 'Cascading Style Sheets', 'Computer Style Sheets', 'Colorful Style Sheets'],
      correctAnswer: 1
    }
  ];

  constructor(private router: Router, private ngZone: NgZone) {}

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
      this.timeRemaining = exam.duration * 60;
      this.loadQuestions(exam.id);
    } else {
      this.timeRemaining = 10 * 60;
      this.examTitle = 'General Knowledge Exam';
      this.questions = this.jsQuestions;
    }

    this.selectedAnswers = new Array(this.questions.length).fill(-1);
    this.startTimer();
  }

  loadQuestions(examId: number) {
    switch(examId) {
      case 1:
        this.questions = this.jsQuestions;
        break;
      case 2:
        this.questions = this.angularQuestions;
        break;
      case 3:
        this.questions = this.webDevQuestions;
        break;
      default:
        this.questions = this.jsQuestions;
    }
  }

  ngOnDestroy() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  startTimer() {
    this.ngZone.runOutsideAngular(() => {
      this.timerInterval = setInterval(() => {
        this.ngZone.run(() => {
          if (this.timeRemaining > 0) {
            this.timeRemaining--;
          } else {
            this.autoSubmit();
          }
        });
      }, 1000);
    });
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
