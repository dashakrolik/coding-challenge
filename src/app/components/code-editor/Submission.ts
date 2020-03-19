// A submission object that maps of the object from the backend.
import { Candidate } from "../candidate/Candidate";
import { Language } from "./Language";
import { Task } from "./Task";

export class Submission {
  constructor(
    public id: number,
    public answer: string,
    public correct: boolean,
    public candidate: Candidate,
    public language: Language,
    public task: Task
  ) {
  }
}
