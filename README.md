<p align="center">
  <img src="https://i.postimg.cc/3N3H59FN/logo.png" width="200" alt="logo">
</p>

<h1 align="center">
  Bankist App
  <br>
<p  align="center">
<a  href="https://www.w3.org/html/"  target="_blank"  rel="noreferrer"> <img  src="https://raw.githubusercontent.com/devicons/devicon/master/icons/html5/html5-original-wordmark.svg"  alt="html5"  width="44"  height="52"/> </a><a  href="https://www.w3schools.com/css/"  target="_blank"  rel="noreferrer"> <img  src="https://raw.githubusercontent.com/devicons/devicon/master/icons/css3/css3-original-wordmark.svg"  alt="css3"  width="44"  height="52"/> </a><a  href="https://developer.mozilla.org/en-US/docs/Web/JavaScript"  target="_blank"  rel="noreferrer"> <img  src="https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg"  alt="javascript"  width="44"  height="44"/> </a>
</p>
</h1>

<p align="center">
  <a href="#project-description">Project Description</a> |
  <a href="#tech-stack-and-libraries">Tech Stack and Libraries</a> |
  <a href="#how-it-works">How it Works</a> |
  <a href="#code-examples">Code Examples</a> |
  <a href="#acknowledgements">Acknowledgements</a>
</p>

<br>

[![Thumbnail-5.png](https://i.postimg.cc/9F9Jqksq/Thumbnail-5.png)](https://postimg.cc/VdYjxKfY)

<div id="project-description"></div>

## 🚀 Project Description
Mapty is a web application that allows users to log their workouts on a map. Users can choose to log running or cycling workouts, and can input data such as distance, duration, and location. The application uses the Geolocation API to display the user's current location on the map, and the Leaflet library to create the map and display workout markers.

<div id="tech-stack-and-libraries"></div>

## 🛠️ Tech Stack and Libraries
- JavaScript
- HTML
- CSS
- Leaflet

<div id="how-it-works"></div>

## ⚙️ How it Works
[![Mapty-flowchart.png](https://i.postimg.cc/QC3VYHxD/Mapty-flowchart.png)](https://postimg.cc/Q9fXHNTY)

When a user loads the Mapty application, the application asks for permission to access the user's location using the Geolocation API. If the user grants permission, their current location is displayed on the map using a marker.

Users can choose to log a workout by clicking on the map at their desired location. This opens a form where they can select the type of workout (running or cycling), input the distance, duration, and other details, and submit the form. The workout is then displayed as a marker on the map.

The application also stores workout data locally using the localStorage API, so that users can access their workout history even after closing and reopening the application.
<div id="code-examples"></div>

## 💻 Code Examples
[![Mapty-architecture-final.png](https://i.postimg.cc/VkGrsf49/Mapty-architecture-final.png)](https://postimg.cc/87vPtV2s)
1. Class constructor code :
```js
// Constructor
 constructor() {
   // Get's user position
   this._getPosition();
   // Get data from local storage
   this._getLocalStorage();
   // Display Map && Toggle
   form.addEventListener('submit', this._newWorkout.bind(this));
   inputType.addEventListener('change', this._toggleElevationField);
   containerWorkouts.addEventListener('click', this._moveToPopUp);
  }
```
This code defines a constructor for a workout app that performs the following actions:
- Calls the ```_getPosition()``` method to get the user's position.
- Calls the ```_getLocalStorage()``` method to get data from the local storage.
- Adds event listeners to the form, inputType, and containerWorkouts elements to perform the following actions:
- When the form element is submitted, the ```_newWorkout()``` method is called.
- When the inputType element is changed, the ```_toggleElevationField()``` method is called.
- When the containerWorkouts element is clicked, the ```_moveToPopUp()``` method is called.

These actions allow the app to display the user's current position, retrieve data from local storage, and perform various actions based on user interactions with the app.

2. Map loading method :
```js
_loadMap(position) {
    const { latitude } = position.coords; // Destructuring Eq position.coords.latitude
    const { longitude } = position.coords;
    const coords = [latitude, longitude];
    // Importing The Map
    this.#map = L.map('map').setView(coords, 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);
    // Create Markers once clicked
    this.#map.on('click', this._showForm.bind(this));
    // Rendering previous map markers
    this.#workouts.forEach(work => {
      this._renderWorkoutMarker(work);
      console.log('Done');
    })
  }
```
The ```_loadMap()``` method is responsible for loading the map and displaying it on the webpage. It first extracts the latitude and longitude coordinates from the user's current position using the ```position.coords``` object. Then, the Leaflet library is used to create a new map object and set the view to the specified coordinates. A tile layer is added to the map to display the OpenStreetMap tiles. The method also sets up an event listener to create markers when the map is clicked and renders previous workout markers by iterating over the ```this.#workouts``` array and calling the ```_renderWorkoutMarker()``` method.
<div id="acknowledgements"></div>

## 📚 Acknowledgements 
This project was created with the help of the course **"The Complete JavaScript Course 2023: From Zero to Expert!"** by **Jonas Schmedtmann**. Many of the concepts and techniques used in this project were learned from this valuable resource.


