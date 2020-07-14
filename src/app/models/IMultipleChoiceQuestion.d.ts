interface IMultipleChoiceQuestion {
    id: number;
    languageId: number;
    questionNumber: number;
    question: string;
    questionCode: string;
    multipleChoiceAnswerOptions: string[]
}