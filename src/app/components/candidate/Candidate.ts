// A candidate object that maps of the object from the backend.
export class Candidate {
  constructor(
    public id: number,
    public firstName: string,
    public lastName: string,
    public email: string,
  ) {
  }
}