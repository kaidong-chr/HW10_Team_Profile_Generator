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
            type: 'input',
            name: 'name',
            message: "What is the employee's name?",
        },
        {
            type: 'input',
            name: 'id',
            message: "What is the employee's ID?",
        },
        {
            type: 'input',
            name: 'email',
            message: "What is the employee's email?",
        },
        {
            type: "list",
            message: "What is your current role?",
            name: "role",
            choices: ['Manager', 'Engineer', 'Intern']
        }
    ])

    // Role dependent switch case, prompting user questions that fit the role
    switch (data.role) {
        // Manager prompt
        case "Manager":
            const manager = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'officeNumber',
                    message: "What is the office number?",
                }
            ])
            // 
            let managerInput = new Manager(data.name, data.id, data.email, manager.officeNumber)
            return managerInput

        // Engineer prompt
        case "Engineer":
            const engineer = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'github',
                    message: "Engineer, what is your github?",
                }
            ])
            let engineerInput = new Engineer(data.name, data.id, data.email, engineer.github)
            return engineerInput

        // Intern prompt
        case "Intern":
            const intern = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'school',
                    message: "Intern, what school do you currently attend?",
                }
            ])
            let internInput = new Intern(data.name, data.id, data.email, intern.school)
            return internInput

        default:
            console.log("Continue")
            return
     }
     
}

// Array to hold the employees
const employee = [];

// Check for if the user wants to input additional team mates, otherwise we generate the html file.
const generateTeam = async () => {
    let team = await basicQuestions();
    employee.push(team);

    inquirer.prompt([
        {
            type: 'confirm',
            name: 'additional',
            message: "Would you like to add more team members?"
        },
    ]).then((data) => {
        if (data.additional) {
            generateTeam();
        } else {
            fs.writeFile(outputPath, render(employee), (err) => err ? console.log(err) : console.log('Team profile generated!'));
        }
    });
};

generateTeam();



// and to create objects for each team member (using the correct classes as blueprints!)

// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```
