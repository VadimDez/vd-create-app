#!/usr/bin/env node

const shell = require("shelljs");
const fs = require("fs");
const colors = require("colors");
const path = require("path");
const inquirer = require("inquirer");
const ejs = require("ejs");
const util = require("util");

const appName = process.argv[2];
const appDirectory = `${process.cwd()}/${appName}`;

const questions = [{
  name: "db",
  type: "list",
  message: "Would you like to use database?",
  choices: [{
      name: "No",
      value: false
    },
    "mysql"
  ]
}, {
  name: "login",
  type: "confirm",
  message: "Would you like to use login?",
  default: true
}];

function loadTemplate(name) {
  let contents = fs.readFileSync(
    path.join(__dirname, "templates", name + ".ejs"),
    "utf-8"
  );
  let locals = Object.create(null);

  function render() {
    console.log(locals);

    return ejs.render(contents, locals, {
      escape: util.inspect
    });
  }

  return {
    locals: locals,
    render: render
  };
}

const run = async () => {
  if (!appName) {
    console.log("No app name passed!".red);
    shell.exit(1);
  }
  const answers = await inquirer.prompt(questions);
  console.log(answers);

  let indexTemplate = loadTemplate("index");

  Object.keys(answers).forEach((key) => {
    indexTemplate.locals[key] = answers[key];
  });

  fs.mkdirSync(appDirectory);
  fs.writeFileSync(path.join(appDirectory, "index.js"), indexTemplate.render());

  console.log(`${appName} created!`);
};
run();