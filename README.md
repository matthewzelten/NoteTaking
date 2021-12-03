https://github.com/matthewzelten/NoteTaking

# NoteTaking
This is a simple application that can store your notes. The landing page serves as a location for users to create folders and access already created folders. Users can search for a folder by name.
When creating a folder the user enters a name and a color with the option of making the folder private and entering a password which is encrypted once submitted. 
When inside of a folder, the user can return to the landing page, delete the folder, search for notes within a folder, access a previously created note, or create a note. Creating a note has similar options to creating a folder: name and color.
Inside of a note, the user can now take notes. They have the option return to the folderpage or take notes and to format their notes. Once ready, they are ready to save their Note!

The UI prototype can be viewed here: https://www.figma.com/file/3ST6u85SmZqZ4lhWHBuwsq/Untitled?node-id=3%3A16

# Developer Environment Setup

## Initializing

Clone the repo with
```
$ git clone {repo url}
```

## Creating your own branch

When ready to push code changes for the first time, run these commands:
```
$ git branch {name of your branch, preferably just your name}
$ git switch {branch name}
$ git add .
$ git commit -m "{message}"
$ git push
```
## How to pull and merge from main
```
$ git switch main
$ git pull
$ git checkout {your branch}
$ git merge origin/main
```
## Running the Application
```
$ cd backend
$ npm run dev
$ cd ../frontend
$ npm start
```

## Styling Code
 We use prettier to style our code :)

### Recommended Plugins 

#### Prettier
  - 4 Space indentation


# Relevant Diagrams

## Component and Deployment Diagram
Last Updated: 12/2/21

https://docs.google.com/drawings/d/1MkoBCeM_cgfh6TXQhVxiuksWsnLOVy2eOFjTwZzEo9U/edit?usp=sharing

## UML Diagram

Last Update: 10/22/21

https://drive.google.com/file/d/1xxpnmCXCTHxab4JEDS-5p60EsnmC_KMj/view?usp=sharing

# Code Coverage Report ........ WORK IN PROGRESS

Update as of 12/3/21 12:31am.
Currently, 95% of our model function's lines are covered by tests, and 100% of our functions are covered by tests.

