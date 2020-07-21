interface IMultipleChoiceQuestion {
    id: number;
    languageId: number;
    questionNumber: number;
    question: string;
    multipleChoiceAnswerOptions: string[];
    questionCode: string;
}