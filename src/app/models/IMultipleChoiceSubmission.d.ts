interface IMultipleChoiceSubmission {
    id: number;
    personId: number;
    languageId: number;
    questionId: number;
    answerId: number;
    isAnswerCorrect: boolean;
}