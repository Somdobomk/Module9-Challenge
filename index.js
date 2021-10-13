const inquirer = require('inquirer');
const fs = require('fs');
const axios = require('axios');
const HTMLtoPDF = require('html-pdf');
let profileObject = {};

// List of questions
const questions = [
	{
		type: 'input',
		message: 'What is your GitHub username?',
		name: 'username',
	},
	{
		type: 'list',
		message: 'What color is your favorite color?',
		choices: ['blue', 'green', 'red', 'purple', 'black'],
		name: 'color',
		default: 'black',
	},
	{
		type: 'input',
		message: 'Enter your github access token',
		name: 'token',
	},
];

// HTML
function generateHTML(response) {
	return `<!DOCTYPE html>
    <html lang='en'>
    <head>
    <meta charset='UTF-8'>
    <meta name='viewport' content="width=device-width, initial-scale=1">
    <title>${response.username} Resume Profile</title>

    <style>
    @import url('https://fonts.googleapis.com/css2?family=Montserrat&display=swap');
    @page {
      margin: 0;
    }
   *,
   *::after,
   *::before {
    box-sizing: border-box;
    }
    html, body {
    padding: 0;
    margin: 0;
    }

    #header {
      background-color: ${response.color};
      color:white;
      text-align: center;
    }

    img {
      border: 2px solid ${response.color};
    }
    
    h1 {
      font-family: Montserrat, serif;
      font-size: 2rem;
    }

    p {
      font-family: Montserrat, serif;
      font-size: 1rem;
      color:${response.color};
    }
    </style>
    </head>

    <body>
      <div id="header">
        <h1>${response.username}</h1>
      </div>

    <img src=${response.avatar}>

    <p>Bio: ${response.bio}</p>

    <a href=${response.blog} target="_blank">Blog</a>
    <br>
    <p>Location: <a href="${response.google_map}">${response.location}</a>
    <p>Followers: ${response.followers}</p>
    <p>Following: ${response.following}</p>
    <p>Repositories: ${response.number_repositories}<p>
    </body>
    </html>`;
}

// Inquirer
inquirer
	.prompt(questions)
	.then(async function (response) {
		profileObject = {
			color: response.color,
			username: response.username,
		};

		// Request GitHub API for number of repos
		await axios
			.get(
				`https://api.github.com/users/${response.username}/repos?per_page=50`
			)
			.then(function (axios_response) {
				profileObject.number_repositories = axios_response.data.length;
			})
			.catch(function (err) {
				console.log(err);
			});

		// Number of followers
		let number_followers;
		await axios
			.get(`https://api.github.com/users/${response.username}/followers`)
			.then(function (axios_response) {
				number_followers = axios_response.data.length;
				console.log('number_followers: ' + number_followers);
			})
			.catch(function (err) {
				console.log(err);
			});

		// Number of following
		let number_following;
		await axios
			.get(`https://api.github.com/users/${response.username}/following`)
			.then(function (axios_response) {
				number_following = axios_response.data.length;
				console.log('number_following: ' + number_following);
			});

		await axios
			.get(`https://api.github.com/users/${response.username}`)
			.then(function (response) {
				console.log(response.data);
				profileObject.blog = response.data.blog;
				profileObject.location = response.data.location;
				profileObject.google_map =
					'https://www.google.com/maps/place/' +
					response.data.location.replace(/\s+/g, '+');
				profileObject.bio = response.data.bio;
				profileObject.avatar = response.data.avatar_url;
				profileObject.followers = number_followers;
				profileObject.following = number_following;
			});
	})
	.then(async function () {
		let filenameHTML = `${profileObject.username}_resume_profile.html`;
		await fs.writeFile(filenameHTML, generateHTML(profileObject), function () {
			console.log('finished writing file');
		});

		let options = { format: 'Landscape' };
		await HTMLtoPDF.create(generateHTML(profileObject), options).toFile(
			'resume_profile.pdf',
			function (err, res) {
				if (err) return console.error(err);
				console.log('wrotePDF');
			}
		);
	})
	.catch(function (err) {
		console.log(err);
	});
