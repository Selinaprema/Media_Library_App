# Media Library App  

## Description  
A web application created as part of a React Capstone project. This application allows users to search for various types of media using the **iTunes Search API**, view search results attractively, and manage a list of favorite items.  

## Getting Started  

### Prerequisites  
Before running the project, ensure you have the following installed:  

- [Node.js](https://nodejs.org/) - Required to run the application  
- [npm](https://www.npmjs.com/) - Comes with Node.js to manage dependencies  
- A modern web browser for testing the app  

### Installation  

Follow these steps to set up the development environment:  

#### Install Dependencies  

1. **Navigate to the frontend folder and install dependencies:**  
    ```bash
    cd frontend
    npm install
    ```
2. **Navigate to the backend folder and install dependencies, including Express:**  
    ```bash
    cd backend
    npm install
    npm install express
    ```

### Running the Application  

#### Start the Backend Server:  
1. Ensure you are in the backend folder:  
    ```bash
    cd backend
    ```
2. Start the backend server:  
    ```bash
    node server.js
    ```

#### Start the Frontend Application:  
1. Open a new terminal and navigate to the frontend folder:  
    ```bash
    cd frontend
    ```
2. Start the React development server:  
    ```bash
    npm start
    ```

This will launch the application at `http://localhost:3000`.  

## Features  

### Front-end  
- A user-friendly and visually appealing interface built with React.  
- A search input field where users can enter a search term and select the type of media (movie, podcast, music, audiobook, software).  
- A favorites list where users can add and remove items.  
- Display search results in an easy-to-navigate format.  

### Back-end  
- A Node.js backend built with the Express framework.  
- A route that interacts with the **iTunes Search API** to fetch media content based on user input.  
- Retrieval and display of album details including album name, artist name, cover image, and release date.  
- Secure API requests using **JSON Web Tokens (JWT)** for authentication.  

## Built With  

- [React](https://reactjs.org/) - A JavaScript library for building user interfaces  
- [React-Router](https://reactrouter.com/) - For managing navigation and routing  
- [Express](https://expressjs.com/) - A minimal Node.js framework for handling backend requests  
- [Axios](https://axios-http.com/) - For making API requests  
- [JWT (jsonwebtoken)](https://github.com/auth0/node-jsonwebtoken) - For securing API requests  

## Authors  

- **Selina Prema**  
