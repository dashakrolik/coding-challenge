interface IPerson {
    id: number;
    firstName: string;
    lastName: string;
    username: string;
    password: string;
    roles: IRole[];
    pointsTasks: number[][];
    points: number[];
    pointsMultipleChoice: number[];
}
