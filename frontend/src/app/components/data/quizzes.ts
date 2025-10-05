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
    { id: 1, question: "What is the correct file extension for Python files?", options: [".py", ".python", ".pt", ".p"], correctAnswer: 0 },
    { id: 2, question: "Which function is used to output text in Python?", options: ["echo()", "print()", "console.log()", "printf()"], correctAnswer: 1 },
    { id: 3, question: "How do you start a comment in Python?", options: ["//", "#", "/* */", "<!-- -->"], correctAnswer: 1 },
    { id: 4, question: "Which keyword is used to create a function in Python?", options: ["function", "func", "def", "lambda"], correctAnswer: 2 },
    { id: 5, question: "What is the output of: type(5)?", options: ["str", "int", "float", "bool"], correctAnswer: 1 },
   
],
"3": [
    { id: 1, question: "What does the mean represent in a dataset?", options: ["Most frequent value", "Middle value", "Average value", "Range"], correctAnswer: 2 },
    { id: 2, question: "Which measure of central tendency is most affected by outliers?", options: ["Mean", "Median", "Mode", "All are equally affected"], correctAnswer: 0 },
    { id: 3, question: "What does standard deviation measure?", options: ["Center of the data", "Spread of the data", "Highest value", "Lowest value"], correctAnswer: 1 },
    { id: 4, question: "If the correlation coefficient is -0.9, what does it mean?", options: ["Strong negative relationship", "Strong positive relationship", "No relationship", "Weak positive relationship"], correctAnswer: 0 },
    { id: 5, question: "What is the probability value (p-value) used for?", options: ["Measuring accuracy", "Testing statistical significance", "Finding mean", "Calculating median"], correctAnswer: 1 }
],
"10": [
    { id: 1, question: "Which company originally developed Java?", options: ["Microsoft", "Sun Microsystems", "Apple", "Oracle"], correctAnswer: 1 },
    { id: 2, question: "Which keyword is used to define a class in Java?", options: ["define", "class", "object", "struct"], correctAnswer: 1 },
    { id: 3, question: "What is the default value of an int variable in Java?", options: ["0", "null", "undefined", "1"], correctAnswer: 0 },
    { id: 4, question: "Which method is the entry point of every Java program?", options: ["start()", "execute()", "main()", "run()"], correctAnswer: 2 },
    { id: 5, question: "Which of these is NOT a Java data type?", options: ["int", "String", "float", "real"], correctAnswer: 3 }
],
"11": [
    { id: 1, question: "Which symbol is used to denote a single-line comment in C#?", options: ["//", "/* */", "#", "--"], correctAnswer: 0 },
    { id: 2, question: "What is the correct file extension for C# source files?", options: [".cs", ".csharp", ".cpp", ".c"], correctAnswer: 0 },
    { id: 3, question: "Which keyword is used to define a class in C#?", options: ["object", "define", "class", "struct"], correctAnswer: 2 },
    { id: 4, question: "Which method serves as the entry point of a C# program?", options: ["main()", "start()", "Main()", "Run()"], correctAnswer: 2 },
    { id: 5, question: "Which of the following is NOT a value type in C#?", options: ["int", "string", "bool", "double"], correctAnswer: 1 }
],
"12": [
    { id: 1, question: "Which command is used to list files and directories in Linux?", options: ["list", "dir", "ls", "show"], correctAnswer: 2 },
    { id: 2, question: "Which command is used to change the current directory?", options: ["cd", "pwd", "mv", "cp"], correctAnswer: 0 },
    { id: 3, question: "What symbol represents the home directory in Linux?", options: ["/", "~", ".", ".."], correctAnswer: 1 },
    { id: 4, question: "Which user has full administrative privileges?", options: ["admin", "root", "super", "master"], correctAnswer: 1 },
    { id: 5, question: "Which command is used to display the current working directory?", options: ["where", "path", "pwd", "dir"], correctAnswer: 2 }
],

"18": [
    { id: 1, question: "What is the main ingredient in concrete?", options: ["Sand", "Cement", "Clay", "Steel"], correctAnswer: 1 },
    { id: 2, question: "Which unit is used to measure force?", options: ["Pascal", "Newton", "Joule", "Watt"], correctAnswer: 1 },
    { id: 3, question: "Which of the following is a type of foundation?", options: ["Slab", "Beam", "Pile", "Column"], correctAnswer: 2 },
    { id: 4, question: "What does RCC stand for?", options: ["Reinforced Cement Concrete", "Rigid Construction Compound", "Reinforced Column Cement", "Ready Concrete Cast"], correctAnswer: 0 },
    { id: 5, question: "Which test is used to determine the strength of concrete?", options: ["Compression test", "Tensile test", "Impact test", "Shear test"], correctAnswer: 0 }
],
"19": [
    { id: 1, question: "What is the unit of electrical resistance?", options: ["Volt", "Ampere", "Ohm", "Watt"], correctAnswer: 2 },
    { id: 2, question: "Which device is used to measure electric current?", options: ["Voltmeter", "Ammeter", "Ohmmeter", "Multimeter"], correctAnswer: 1 },
    { id: 3, question: "What does AC stand for in electricity?", options: ["Active Current", "Alternating Current", "Average Current", "Amplified Current"], correctAnswer: 1 },
    { id: 4, question: "Which law relates voltage, current, and resistance?", options: ["Newton’s Law", "Ohm’s Law", "Faraday’s Law", "Kirchhoff’s Law"], correctAnswer: 1 },
    { id: 5, question: "What is the unit of electric power?", options: ["Volt", "Watt", "Ohm", "Joule"], correctAnswer: 1 }
],


};
