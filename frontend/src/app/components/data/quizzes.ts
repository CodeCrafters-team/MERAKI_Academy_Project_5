// src/app/data/quizzes.ts

export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

export const quizzes: Record<string, Question[]> = {
  "1": [
    { id: 1, question: "What is JavaScript mainly used for?", options: ["Styling", "Structure", "Behavior", "Database"], correctAnswer: 2 },
    { id: 2, question: "Which symbol is used for single-line comments?", options: ["//", "/* */", "#", "<!-- -->"], correctAnswer: 0 },
    { id: 3, question: "Which company developed JavaScript?", options: ["Microsoft", "Netscape", "Google", "Apple"], correctAnswer: 1 },
    { id: 4, question: "Which keyword declares a variable with block scope?", options: ["var", "let", "function", "constant"], correctAnswer: 1 },
    { id: 5, question: "What does NaN stand for?", options: ["Not a Number", "Number and Null", "Negative a Number", "Null Number"], correctAnswer: 0 },
  ],
  "2": [
    { id: 1, question: "Which operator is used for strict equality?", options: ["==", "=", "===", "!="], correctAnswer: 2 },
    { id: 2, question: "Which method converts a JSON string into an object?", options: ["JSON.stringify()", "JSON.parse()", "JSON.object()", "JSON.toString()"], correctAnswer: 1 },
    { id: 3, question: "Which method removes the last element of an array?", options: ["push()", "pop()", "shift()", "unshift()"], correctAnswer: 1 },
    { id: 4, question: "What is the correct way to declare a constant?", options: ["var", "let", "const", "constant"], correctAnswer: 2 },
    { id: 5, question: "Which keyword is used to define a function?", options: ["func", "function", "def", "method"], correctAnswer: 1 },
  ],
  "3": [
    { id: 1, question: "Which loop is guaranteed to run at least once?", options: ["for", "while", "do...while", "foreach"], correctAnswer: 2 },
    { id: 2, question: "Which method adds an element at the end of an array?", options: ["push()", "pop()", "shift()", "unshift()"], correctAnswer: 0 },
    { id: 3, question: "What will typeof null return?", options: ["null", "object", "undefined", "number"], correctAnswer: 1 },
    { id: 4, question: "Which keyword declares a variable available globally?", options: ["let", "const", "var", "all of them"], correctAnswer: 2 },
    { id: 5, question: "What does DOM stand for?", options: ["Document Object Model", "Data Object Model", "Document Oriented Mode", "Display Object Method"], correctAnswer: 0 },
  ],
  "4": [
    { id: 1, question: "Which method removes the first element of an array?", options: ["push()", "pop()", "shift()", "unshift()"], correctAnswer: 2 },
    { id: 2, question: "Which method adds an element to the beginning of an array?", options: ["push()", "pop()", "shift()", "unshift()"], correctAnswer: 3 },
    { id: 3, question: "What does JSON stand for?", options: ["JavaScript Object Notation", "Java Standard Object Notation", "JavaScript Object Name", "JavaScript Oriented Notation"], correctAnswer: 0 },
    { id: 4, question: "Which event occurs when a user clicks on an element?", options: ["onclick", "onhover", "onchange", "onmouseover"], correctAnswer: 0 },
    { id: 5, question: "What is the correct syntax to print in the console?", options: ["console.print()", "console.log()", "print.console()", "log.console()"], correctAnswer: 1 },
  ],
  "5": [
    { id: 1, question: "Which keyword is used to exit a loop?", options: ["break", "stop", "exit", "return"], correctAnswer: 0 },
    { id: 2, question: "Which array method creates a new array with results of calling a function?", options: ["map()", "forEach()", "filter()", "reduce()"], correctAnswer: 0 },
    { id: 3, question: "Which keyword is used to handle errors?", options: ["try", "catch", "throw", "all of them"], correctAnswer: 3 },
    { id: 4, question: "What is the result of 2 + '2' in JavaScript?", options: ["4", "'4'", "'22'", "Error"], correctAnswer: 2 },
    { id: 5, question: "Which method joins all array elements into a string?", options: ["join()", "concat()", "push()", "toString()"], correctAnswer: 0 },
  ],
  "6": [
    { id: 1, question: "Which method returns the length of an array?", options: ["length()", "size()", "count()", "length"], correctAnswer: 3 },
    { id: 2, question: "Which function is used to delay execution?", options: ["setTimeout()", "setInterval()", "delay()", "wait()"], correctAnswer: 0 },
    { id: 3, question: "Which operator is used for logical AND?", options: ["&", "&&", "||", "|"], correctAnswer: 1 },
    { id: 4, question: "Which keyword is used to define a class?", options: ["class", "object", "struct", "type"], correctAnswer: 0 },
    { id: 5, question: "Which method finds an element in an array?", options: ["find()", "filter()", "search()", "index()"], correctAnswer: 0 },
  ],
  "7": [
    { id: 1, question: "Which keyword declares a block-scoped variable?", options: ["var", "let", "const", "both let and const"], correctAnswer: 3 },
    { id: 2, question: "Which method converts an object to a JSON string?", options: ["JSON.stringify()", "JSON.parse()", "JSON.object()", "JSON.toString()"], correctAnswer: 0 },
    { id: 3, question: "Which symbol is used for multi-line comments?", options: ["//", "/* */", "#", "<!-- -->"], correctAnswer: 1 },
    { id: 4, question: "Which keyword is used to create a function expression?", options: ["func", "function", "const", "let"], correctAnswer: 2 },
    { id: 5, question: "Which method removes whitespace from both ends of a string?", options: ["trim()", "strip()", "slice()", "substring()"], correctAnswer: 0 },
  ],
};
