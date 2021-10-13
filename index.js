const inquirer = require('inquirer');
const fs = require('fs');
const generateReadMe = require('./utils/generateMarkdown');

// List of questions
const questions = [
	{
		type: 'input',
		name: 'Project_Title',
		message: 'What is your project title?',
		default: 'Project_Title',
	},

	{
		type: 'input',
		name: 'Project_Description',
		message: 'Please give a description for your project.',
		default: 'Project_Description',
	},

	{
		type: 'input',
		name: 'Installation_Instructions',
		message: 'What are the install instructions for your project?',
		default: 'Installation_Instructions',
	},

	{
		type: 'input',
		name: 'Usage_Information',
		message: 'Provide information on how the user will use your application.',
		default: 'Usage_Information',
	},

	{
		type: 'input',
		name: 'Contribution_Guidelines',
		message: 'What are the contribution guidelines for your project?',
		default: 'Contribution_Guidelines',
	},

	{
		type: 'input',
		name: 'Test_Instructions',
		message: 'Please provide test instructions for your project.',
		default: 'Test_Instructions',
	},

	{
		type: 'list',
		name: 'License_Badge',
		message: 'Please choose a license from the following list:',
		choices: ['Javascript', 'Ruby', 'Haskell', 'Python'],
		default: 'Javascript',
	},

	{
		type: 'input',
		name: 'GitHub_Username',
		message: 'What is your GitHub username?',
		default: 'GitHub_Username',
	},

	{
		type: 'input',
		name: 'Email_Address',
		message: 'What is your email address?',
		default: 'Email_Address',
	},
];

// Function for README file
function writeToFile(fileName, data) {
	fs.writeFile(fileName, data, (err) => {
		if (err) {
			return console.log(err);
		}
		console.log('README.md successfully created!');
	});
}

// Function for initializing app
function init() {
	inquirer
		.prompt(questions)
		.then((response) => generateReadMe(response))
		.then((readme) => {
			console.log(readme);
			writeToFile('./generated/README.md', readme, (err) => {
				if (err) {
					console.log(err);
					return;
				}
				console.log('README.md was successfully created!');
			});
		})
		.catch((err) => console.log(err));
}

init();
