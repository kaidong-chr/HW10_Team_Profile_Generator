const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

// Inquirer prompts to gather input info.
// Basic questions shared by all three roles and user defined role
basicQuestions = async () => {
  const data = await inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: "What is the employee's name?",
    },
    {
      type: "input",
      name: "id",
      message: "What is the employee's ID?",
    },
    {
      type: "input",
      name: "email",
      message: "What is the employee's email?",
    },
    {
      type: "list",
      message: "What is your current role?",
      name: "role",
      choices: ["Manager", "Engineer", "Intern"],
    },
  ]);

  // Role dependent switch case, prompting user questions that fit the role
  switch (data.role) {
    // Manager prompt
    case "Manager":
      const manager = await inquirer.prompt([
        {
          type: "input",
          name: "officeNumber",
          message: "What is the office number?",
        },
      ]);
      //
      let managerInput = new Manager(
        data.name,
        data.id,
        data.email,
        manager.officeNumber
      );
      return managerInput;

    // Engineer prompt
    case "Engineer":
      const engineer = await inquirer.prompt([
        {
          type: "input",
          name: "github",
          message: "Engineer, what is your github?",
        },
      ]);
      let engineerInput = new Engineer(
        data.name,
        data.id,
        data.email,
        engineer.github
      );
      return engineerInput;

    // Intern prompt
    case "Intern":
      const intern = await inquirer.prompt([
        {
          type: "input",
          name: "school",
          message: "Intern, what school do you currently attend?",
        },
      ]);
      let internInput = new Intern(
        data.name,
        data.id,
        data.email,
        intern.school
      );
      return internInput;

    default:
      console.log("Continue");
      return;
  }
};

// Array to hold the employees
const employee = [];

// Check for if the user wants to input additional team mates, otherwise generate the html file.
const generateTeam = async () => {
  let team = await basicQuestions();
  employee.push(team);

  inquirer
    .prompt([
      {
        type: "confirm",
        name: "additional",
        message: "Would you like to add more team members?",
      },
    ])
    .then((data) => {
      if (data.additional) {
        generateTeam();
      } else {
        fs.writeFile(outputPath, render(employee), (err) =>
          err ? console.log(err) : console.log("Team profile generated!")
        );
      }
    });
};

generateTeam();