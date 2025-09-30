export interface Answer {
  id: number;
  answer_text: string;
  is_correct: boolean;
}

export interface Question {
  id: number;
  question_text: string;
  answers: Answer[];
}

export interface Quiz {
  id: number;
  title: string;
  description: string;
  questions?: Question[];
}
