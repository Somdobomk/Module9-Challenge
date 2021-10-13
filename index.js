const inquirer = require('inquirer');
const fs = require('fs');
const generateReadMe = require('./utils/generateMarkdown');

// List of questions
const questions = [
	{
		type: 'input',
		name: 'title',
		message: 'What is your project title?',
		default: 'Project_Title',
	},

	{
		type: 'input',
		name: 'description',
		message: 'Please give a description for your project.',
		default: 'Project_Description',
	},

	{
		type: 'input',
		name: 'installation',
		message: 'What are the install instructions for your project?',
		default: 'Installation_Instructions',
	},

	{
		type: 'input',
		name: 'usage',
		message: 'Provide information on how the user will use your application.',
		default: 'Usage_Information',
	},

	{
		type: 'input',
		name: 'contribution',
		message: 'What are the contribution guidelines for your project?',
		default: 'Contribution_Guidelines',
	},

	{
		type: 'input',
		name: 'test',
		message: 'Please provide test instructions for your project.',
		default: 'Test_Instructions',
	},

	{
		type: 'list',
		name: 'license',
		message: 'Please choose a license from the following list:',
		choices: ['Javascript', 'Ruby', 'Haskell', 'Python'],
		default: 'Javascript',
	},

	{
		type: 'input',
		name: 'github',
		message: 'What is your GitHub username?',
		default: 'GitHub_Username',
	},

	{
		type: 'input',
		name: 'email',
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
