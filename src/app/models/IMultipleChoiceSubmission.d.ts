interface IMultipleChoiceSubmission {
    id: number;
    personId: number;
    languageId: number;
    questionId: number;
    answer: string;
    isAnswerCorrect: boolean;
}
