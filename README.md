# CodeChallenge
To make working with a team a treat, we have introduced a few tools.

1. We have [a Trello board](https://trello.com/b/HkQxdEbU) to which you will receive an invite (ask for it if you haven't received one yet).
2. We have [a Slack group](https://codechallenge-group.slack.com) which we use to communicate.

Great that you're joining the team!

## The goal of this project
The CodeChallenge app will be used as an (internal) competition tool. The idea would be to compete with your colleagues for a place on the leaderboard. This leaderboard would be based on things like code execution speed and maybe readability.

Perhaps a link to an assignment could also be passed around on other platforms for recruitment purposes. 

# Getting started
1. _The designs for this project_ [can be viewed via this Dropbox folder](https://www.dropbox.com/sh/y29tjign13yg90k/AABhVezrI8vZJFgGI9hjUTNda?dl=0). 
2. We are using TSLint heavily, and it might be best to also download a few (VSCode) extensions:
    - [TS Import Sorter](https://marketplace.visualstudio.com/items?itemName=mike-co.import-sorter) to auto-sort your imports (preferably run this on save).
    - [TSLint](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-typescript-tslint-plugin) to make sure you follow the tslint rules (preferably also run this on save).

# mvp
A working prototype in which:
- Developers can submit their code,
- The code should be checked on functionality (not on speed etc.),
- Admins should be able to:
    - View submitted code,
    - Change the assignments,
    - View the submissions,
- There should be a game-element.

# Running the project
This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 9.0.3.

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
