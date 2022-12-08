# Social_Network_API

## Description

The goal of this project was to build a simulated backend of a social media site using a NoSQL database and routing. The created program acts as the backend of a social media site containing users and their 'thoughts' (aka posts) and 'reactions' (aka responses to posts). Each user must have a unique name and a unique and valid email. During this project I learned how to manipulate and route using a Mongoose database and reviewed use of express.

## Installation

The runtime Node.js must be installed, after which all necessary packages can be installed by typing "npm i" into the terminal. The NoSQL database MongoDB must also be installed. For testing routes an API client should be installed and it is recommend that Insomnia be used, as it was the client used during testing. The database can be seeded with users by typing "node utils/seed.js" in the temrinal.

## Usage

The created program acts as a social media site backend that stores users and their 'thoughts' (aka posts),'reactions' (aka responses to posts), and their friends. Before initialization the program's database may be seeded with users by typing "node utils/seed.js" into the temrinal. To initialize the program one should type "node server.js" in the temrinal. 

The extension "api/users" as a GET route will return all current users and as a POST route will create a new user using provided JSON parameters. The extension "api/users/:userId" as a GET route will return the user that has the provided userId, as a PUT route will update the user with the provided userId using provided JSON parameters, and as a DELETE route will delete the user with the provided userId. The extension "api/users/:userId/friends/:friendId" as a POST route will add the provided friendId to the friend list of the user with the provided userId and as a DELETE route will remove the provided friendId from the friend list of the user with the provided userId. 

The extension "api/thoughts" as a GET route will return all current thoughts and as a POST route will create a new thought using provided JSON parameters. The extension "api/thoughts/:thoughtId" as a GET route will return the thought that has the provided thoughtId, as a PUT route will update the thought that has the provided thoughtId using provided JSON parameters, and as a DELETE route will delete the thought with a provided thoughtId. The extension "/api/thoughts/:thoughtId/reactions" is a PUT route that adds a new reaction that is built using provided JSON parameters to the reaction list of the thought with a provided thoughtId. The extension "api/users/:userId/friends/:friendId" is a DELETE route that will remove the provided reactionId from the reaction list of the thought with the provided thoughtId. 

## Credits

N/A

## License

Please refer to the license in the repo

## Links and Images
Github Repo URL: https://github.com/fortu038/Social_Network_API
Walkthrough Video URL: https://drive.google.com/file/d/1Yx1f296F3iEj-L96JOHRNNHGpQF5Bm3q/view
