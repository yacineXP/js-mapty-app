'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

class App {
  #map;
  #mapEvent;
  #workouts = [];


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

  // 1. Getting Position From Navigator
  _getPosition() {
    if (navigator.geolocation)
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this), // this._loadMap et non pas this._loadMap() : call back functions mean that getCurrentPosition will call it and passed position in it ; but this._loadMap we'll call it
        function () {
          // by default in a call back function the this keyword is set to undified
          alert('Could not get your position');
        }
      );
  }

  // 2. Loading The Map According to The User Position
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

  // Displaying the form also
  _showForm(mapE) {
    this.#mapEvent = mapE;
    form.classList.remove('hidden');
    inputDistance.focus();
    inputElevation.value = inputCadence.value = inputDistance.value = '';
  }

  // Switch Between Cadence & Elevation
  _toggleElevationField() {
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
  }

  // Creating a New Workout
  _newWorkout(e) {
    // 1.Data Check
    const positifNumCheck = (...numbers) => numbers.every(num => num > 0);
    const finiteNumCheck = (...chars) =>
      chars.every(char => Number.isFinite(char));
    // 
    e.preventDefault();
    // 2.Get data from the form
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;
    const latlng = this.#mapEvent.latlng;
    const type = inputType.value;
    let workout;
    // 3. Creating Objects
    if (type === 'running') { // if workout running, create running object
      const cadence = +inputCadence.value;
      if (!positifNumCheck(cadence) || !finiteNumCheck(cadence)) {
        alert('Please Enter a Valid Number');
        return;
      }
      workout = new Running(Object.values(latlng), distance, duration, cadence);
    }
    if (type === 'cycling') { // if workut cycling, create cycling object
      const elevation = +inputElevation.value;
      if (!positifNumCheck(elevation) || !finiteNumCheck(elevation)) {
        alert('Please Enter a Valid Number ');
        return;
      }
      workout = new Cycling(
        Object.values(latlng),
        distance,
        duration,
        elevation
      );
    }
    // Add The workout to the table
    this.#workouts.push(workout);
    // Display marker
    this._renderWorkoutMarker(workout, type);
    console.log(this.#workouts);
    // Rendering workout
    this._renderWorkout(workout);
    // Hide Form
    this._hideForm();
    // Set the local storage to all workouts
    this._setLocalStorage();
  }


  // Local Storage
  _getLocalStorage() {
    const data = JSON.parse(localStorage.getItem("workouts"));

    if (!data) return;

    this.#workouts = data;

    this.#workouts.forEach(work => {
      this._renderWorkout(work);
    })
  }

  _setLocalStorage() {
    localStorage.setItem('workouts', JSON.stringify(this.#workouts));
  }

  // Hide Form After Creating a new one
  _hideForm() {
    inputElevation.value = inputCadence.value = inputDistance.value = '';
    form.style.display = 'none';
    form.classList.add('hidden');
    setTimeout(() => (form.style.display = 'grid'), 1000);
  }

  // Displaying the workouts's form
  _renderWorkout(workout) {
    let html = `
      <li class="workout workout--${workout.type}" data-id="${workout.id}">
          <h2 class="workout__title">${workout.description}</h2>
          <div class="workout__details">
            <span class="workout__icon">${
              workout.type === 'running' ? '🏃‍♂️' : '🦶🏼'
            }</span>
            <span class="workout__value">${workout.distance}</span>
            <span class="workout__unit">km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⏱</span>
            <span class="workout__value">${workout.duration}</span>
            <span class="workout__unit">min</span>
          </div>
          <div class="workout__details">
          <span class="workout__icon">⏱</span>
          <span class="workout__value">${workout.cadence}</span>
          <span class="workout__unit">min</span>
        </div>
    `;
    if (workout.type === 'running')
      html += `     
      <div class="workout__details">
        <span class="workout__icon">⚡️</span>
        <span class="workout__value">455</span>
        <span class="workout__unit">min/km</span>
      </div>
      </li> `;

    if (workout.type === 'cycling')
      html += `
        <div class="workout__details">
          <span class="workout__icon">🦶🏼</span>
          <span class="workout__value">${workout.elevationGain}</span>
          <span class="workout__unit">spm</span>
        </div> 
      </li>
    `;
    form.insertAdjacentHTML('afterend', html);
  }

  // Workout Marker
  _renderWorkoutMarker(workout) {
    L.marker(Object.values(workout.coords))
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWith: 250,
          minWith: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${workout.type}-popup`,
        })
      )
      .setPopupContent(workout.description)
      .openPopup();
  }

  _moveToPopUp(e) {
    const workoutEl = e.target.closest('.workout');
    console.log(workoutEl);
  }

  
}

const app = new App();

// Workouts Classes
class Workout {
  type = '';
  date = new Date();
  id = (new Date() + '').slice(-10);

  constructor(coords, distance, duration) {
    this.coords = coords;
    this.distance = distance;
    this.duration = duration;
  }

  _setDescription() {
    //prettier-ignore
    const month = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];

    this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${
      month[this.date.getMonth()]
    } ${this.date.getDate()}`;

    return this.description;
  }
}

class Running extends Workout {
  type = 'running';
  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.calcPace();
    this.description = this._setDescription();
  }

  calcPace() {
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}

class Cycling extends Workout {
  type = 'cycling';
  constructor(coords, distance, duration, elevationGain) {
    super(coords, distance, duration);
    this.cadence = elevationGain;
    this.calcSpeed();
    this.description = this._setDescription();
  }

  calcSpeed() {
    this.speed = this.distance / (this.duration / 60);
  }
}


document.addEventListener('keydown', function(e) {
  if (e.key == "q") {
    localStorage.clear(); 
    console.log('Clicked');
  }
})