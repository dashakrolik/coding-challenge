# CodeChallenge

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 9.0.3.

## The goal
Ordina needs a tool to help with the onboarding of new recruits. Now, measuring the recruit's coding skill is done via an assignment which they need to complete. This is then checked manually for code quality.
The CodeChallenge tool's goal is to automate this process. The general flow is the following:
1. A recruit first goes to the CodeChallenge app and completes a few assignments. 
2. These assignments are automatically checked on code complexity and execution speed
3. If the recruit completes with a certain positive percentage of the CodeChallenge score (let's say: 80%), they are automatically invited for an interview. Maybe they also need to complete a custom challenge, but the idea is to filter out the coders that are not qualified.

### Another goal: internal competition
Next to streamlining the onboarding process, the CodeChallenge app could also be used as an internal competition tool. The idea would be to upload a new assignment each month and to compete with your colleagues for a place on the leaderboard. This leaderboard would be based on the same requirements as the onboarding process and maybe also the time. 

Perhaps a link to an assignment could also be passed around on other platforms for recruitment purposes. 

# mvp
Only Java and Python need to be checked. 

# Running the project
Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
