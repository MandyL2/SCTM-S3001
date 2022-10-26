//professor layton music library
/**
 * Game Series
 * Image
 * Title
 * Song url
 *
 *
 * Spotify library set up
 * album for each game
 * 3 songs each album
 * sidebar nav
 *
 * reference: https://www.geeksforgeeks.org/create-a-music-player-using-javascript/
 */

let curiousVillage = [
	{
		name: "Professor Layton's Theme (Live)",
		img: "",
		path: "./audio/Curious_Village/Professor Layton's Theme (Live).mp3",
	},
	{
		name: "About Town",
		img: "",
		path: "./audio/Curious_Village/About Town.mp3",
	},
	{
		name: "End Theme",
		img: "",
		path: "./audio/Curious_Village/End Theme.mp3",
	},
];

let diaBox = [
	{
		name: "Theme of the Diabolical Box",
		img: "",
		path: "./audio/Diabolical_Box/Theme of the Diabolical Box.mp3",
	},
	{
		name: "Folsense (Live)",
		img: "",
		path: "./audio/Diabolical_Box/Folsense (Live).mp3",
	},
	{
		name: "Iris (Music Box Version)",
		img: "",
		path: "./audio/Diabolical_Box/iris_Music Box.mp3",
	},
];

let unwoundFuture = [
	{
		name: "The Lost Future",
		img: "",
		path: "./audio/Unwound_Future/The Lost Future.mp3",
	},
	{
		name: "Sorrow",
		img: "",
		path: "./audio/Unwound_Future/Sorrow.mp3",
	},
	{
		name: "Time Travel (Japanese)",
		img: "",
		path: "./audio/Unwound_Future/Time Travel JP.mp3",
	},
];

let playpause_btn = document.querySelector(".playPause-track");
let next_btn = document.querySelector(".next-track");
let prev_btn = document.querySelector(".prev-track");

let seek_slider = document.querySelector(".seek_slider");
let volume_slider = document.querySelector(".volume_slider");
let curr_time = document.querySelector(".current-time");
let total_duration = document.querySelector(".total-duration");

// let isPlaying = true;

//global variables
let track_index = 0;
let isPlaying = false;
let updateTimer;
let track_list = curiousVillage;

let curr_track = document.createElement("audio");

function switchAlbum(num) {
	switch (num) {
		case 1:
			document.getElementById("cover").src = "./images/curious_village.jpg";
			document.getElementById("album-name").innerHTML = "Professor Layton & the Curious Village";
			track_list = curiousVillage;
			document.getElementById("track1").innerHTML = curiousVillage[0].name;
			document.getElementById("track2").innerHTML = curiousVillage[1].name;
			document.getElementById("track3").innerHTML = curiousVillage[2].name;
			break;
		case 2:
			document.getElementById("cover").src = "./images/diabolical_box.jpg";
			document.getElementById("album-name").innerHTML = "Professor Layton & the Diabolical Box";
			track_list = diaBox;
			document.getElementById("track1").innerHTML = diaBox[0].name;
			document.getElementById("track2").innerHTML = diaBox[1].name;
			document.getElementById("track3").innerHTML = diaBox[2].name;
			break;
		case 3:
			document.getElementById("cover").src = "./images/unwound_future.jpg";
			document.getElementById("album-name").innerHTML = "Professor Layton & the Unwound Future";
			track_list = unwoundFuture;
			document.getElementById("track1").innerHTML = unwoundFuture[0].name;
			document.getElementById("track2").innerHTML = unwoundFuture[1].name;
			document.getElementById("track3").innerHTML = unwoundFuture[2].name;
	}
	console.log("clicked");
}

function playAudio(id) {
	let song1 = document.getElementById(id);
	isPlaying = !isPlaying;
	if (!isPlaying) {
		song1.play();
	} else if (isPlaying) {
		song1.pause();
	}
}

function loadTrack(track_index) {
	// Clear the previous seek timer
	clearInterval(updateTimer);
	resetValues();

	// Load a new track
	curr_track.src = track_list[track_index].path;
	curr_track.load();

	// Update details of the track
	// track_art.style.backgroundImage = "url(" + track_list[track_index].image + ")";
	// track_name.textContent = track_list[track_index].name;

	// Set an interval of 1000 milliseconds
	// for updating the seek slider
	updateTimer = setInterval(seekUpdate, 1000);

	// Move to the next track if the current finishes playing
	// using the 'ended' event
	curr_track.addEventListener("ended", nextTrack);
}

// Function to reset all values to their default
function resetValues() {
	curr_time.textContent = "00:00";
	total_duration.textContent = "00:00";
	seek_slider.value = 0;
}

function playPauseTrack() {
	// Switch between playing and pausing
	// depending on the current state
	if (!isPlaying) playTrack();
	else pauseTrack();
}

function playTrack() {
	// Play the loaded track
	curr_track.play();
	isPlaying = true;

	// Replace icon with the pause icon
	playpause_btn.innerHTML = '<span class="material-symbols-outlined">pause_circle</span>';
}

function pauseTrack() {
	// Pause the loaded track
	curr_track.pause();
	isPlaying = false;

	// Replace icon with the play icon
	playpause_btn.innerHTML = '<span class="material-symbols-outlined"> play_circle </span>';
}

function nextTrack() {
	// Go back to the first track if the
	// current one is the last in the track list
	if (track_index < track_list.length - 1) track_index += 1;
	else track_index = 0;

	// Load and play the new track
	loadTrack(track_index);
	playTrack();
}

function prevTrack() {
	// Go back to the last track if the
	// current one is the first in the track list
	if (track_index > 0) track_index -= 1;
	else track_index = track_list.length - 1;

	// Load and play the new track
	loadTrack(track_index);
	playTrack();
}
function seekTo() {
	// Calculate the seek position by the
	// percentage of the seek slider
	// and get the relative duration to the track
	seekto = curr_track.duration * (seek_slider.value / 100);

	// Set the current track position to the calculated seek position
	curr_track.currentTime = seekto;
}

function seekUpdate() {
	let seekPosition = 0;

	// Check if the current track duration is a legible number
	if (!isNaN(curr_track.duration)) {
		seekPosition = curr_track.currentTime * (100 / curr_track.duration);
		seek_slider.value = seekPosition;

		// Calculate the time left and the total duration
		let currentMinutes = Math.floor(curr_track.currentTime / 60);
		let currentSeconds = Math.floor(curr_track.currentTime - currentMinutes * 60);
		let durationMinutes = Math.floor(curr_track.duration / 60);
		let durationSeconds = Math.floor(curr_track.duration - durationMinutes * 60);

		// Add a zero to the single digit time values
		if (currentSeconds < 10) {
			currentSeconds = "0" + currentSeconds;
		}
		if (durationSeconds < 10) {
			durationSeconds = "0" + durationSeconds;
		}
		if (currentMinutes < 10) {
			currentMinutes = "0" + currentMinutes;
		}
		if (durationMinutes < 10) {
			durationMinutes = "0" + durationMinutes;
		}

		// Display the updated duration
		curr_time.textContent = currentMinutes + ":" + currentSeconds;
		total_duration.textContent = durationMinutes + ":" + durationSeconds;
	}
}

loadTrack(track_index);
