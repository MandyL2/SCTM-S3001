/**
 * references: https://www.geeksforgeeks.org/create-a-music-player-using-javascript/
 * https://github.com/OrionJoshi/Music_Player_Using_LinkedList
 */

class Node {
	constructor(name, path) {
		this.musicNode = {
			name: name,
			path: path,
		};
		this.prev = null;
		this.next = null;
	}
}

class DoubleLinkedList {
	constructor() {
		this.head = null;
		this.tail = null;
		this.length = 0;
		this.tempPos = null;
		this.index = 0;
	}

	insert(name, path) {
		const newNode = new Node(name, path);

		if (this.length === 0) {
			this.head = newNode;
			this.tail = newNode;
		} else {
			this.tail.next = newNode;
			newNode.prev = this.tail;
			this.tail = newNode;
		}
		this.length++;
	}

	get(index) {
		//if index passed in is less than 0 or more than the length of the linked list
		//or is the same as the current index, return unchanged node
		if (index < 0 || index >= this.length || index == this.index) {
			return this.tempPos;
		} else {
			//if the index we are looking for is less than the current index
			//direction goes backwards, else direction of travel goes forwards
			if (index < this.index) {
				let counter = this.index;
				while (counter > index) {
					this.tempPos = this.tempPos.prev;
					counter -= 1;
					// console.log(index);
					// console.log(this.tempPos);
				}
			} else {
				let counter = 0;
				while (counter < index && this.tempPos.next != null) {
					this.tempPos = this.tempPos.next;
					counter += 1;
					// console.log(index);
					// console.log(this.tempPos);
				}
			}
		}
		//update current index
		this.index = index;
		return this.tempPos;
	}

	traverse(direction) {
		if (direction == 1 && this.tempPos.next != null) {
			this.tempPos = this.tempPos.next;
			this.index++;
			console.log(this.tempPos);
			return this.tempPos.musicNode;
		} else if (direction == -1 && this.tempPos.prev != null) {
			this.tempPos = this.tempPos.prev;
			this.index--;
			console.log(this.tempPos);
			return this.tempPos.musicNode;
		} else {
			return 0;
		}
	}

	setDefaultPointer() {
		this.tempPos = this.head;
	}
}

//array of data of each album containing album cover image, album title,
//and name and path of each track
let curiousVillage = [
	"/images/curious_village.jpg",
	"Professor Layton and the Curious Village",
	{
		name: "Professor Layton's Theme (Live)",
		path: "/audio/Curious_Village/Professor Layton's Theme (Live).mp3",
	},
	{
		name: "Puzzles",
		path: "/audio/Curious_Village/Puzzles.mp3",
	},
	{
		name: "About Town",
		path: "/audio/Curious_Village/About Town.mp3",
	},
	{
		name: "The Veil of Night",
		path: "/audio/Curious_Village/The Veil of Night.mp3",
	},
	{
		name: "End Theme",
		path: "/audio/Curious_Village/End Theme.mp3",
	},
];

let diaBox = [
	"/images/diabolical_box.jpg",
	"Professor Layton and the Diabolical Box",
	{
		name: "Theme of the Diabolical Box",
		path: "/audio/Diabolical_Box/Theme of the Diabolical Box.mp3",
	},
	{
		name: "Suspense",
		path: "/audio/Diabolical_Box/Suspense.mp3",
	},
	{
		name: "Folsense (Live)",
		path: "/audio/Diabolical_Box/Folsense (Live).mp3",
	},
	{
		name: "To the Darkness",
		path: "/audio/Diabolical_Box/To the Darkness.mp3",
	},
	{
		name: "Iris (Music Box Version)",
		path: "/audio/Diabolical_Box/iris_Music Box.mp3",
	},
];

let unwoundFuture = [
	"/images/unwound_future.jpg",
	"Professor Layton and the Unwound Future",
	{
		name: "The Lost Future",
		path: "/audio/Unwound_Future/The Lost Future.mp3",
	},
	{
		name: "Puzzle Battle",
		path: "/audio/Unwound_Future/Puzzle Battle.mp3",
	},
	{
		name: "Don Paolo's Theme",
		path: "/audio/Unwound_Future/Don Paolo's Theme.mp3",
	},
	{
		name: "Sorrow",
		path: "/audio/Unwound_Future/Sorrow.mp3",
	},
	{
		name: "Time Travel (Japanese)",
		path: "/audio/Unwound_Future/Time Travel JP.mp3",
	},
];

//creating a linked list for each album
const playlist1 = new DoubleLinkedList();
for (let i = 2; i < curiousVillage.length; i++) {
	playlist1.insert(curiousVillage[i].name, curiousVillage[i].path);
}

const playlist2 = new DoubleLinkedList();
for (let i = 2; i < diaBox.length; i++) {
	playlist2.insert(diaBox[i].name, diaBox[i].path);
}

const playlist3 = new DoubleLinkedList();
for (let i = 2; i < unwoundFuture.length; i++) {
	playlist3.insert(unwoundFuture[i].name, unwoundFuture[i].path);
}

playlist1.setDefaultPointer();
playlist2.setDefaultPointer();
playlist3.setDefaultPointer();
console.log(playlist1);

let playpause_btn = document.querySelector(".playPause-track");
let next_btn = document.querySelector(".next-track");
let prev_btn = document.querySelector(".prev-track");
let track_name = document.querySelector(".song-title");
let seek_slider = document.querySelector(".seek_slider");
let volume_slider = document.querySelector(".volume_slider");
let curr_time = document.querySelector(".current-time");
let total_duration = document.querySelector(".total-duration");

//global variables
let track_index = 1;
let track_update;
let isPlaying = false;
let updateTimer;
let track_list = playlist1;

let curr_track = document.createElement("audio");
curr_track.src = track_list.head.musicNode.path;

function switchAlbum(playlist, album) {
	track_list = playlist;
	document.getElementById("cover").src = album[0];
	document.getElementById("album-name").innerHTML = album[1];
	for (let i = 2; i <= playlist.length + 1; i++) {
		document.getElementById(`track${i - 1}`).innerHTML = album[i].name;
	}
	track_index = 1;
	loadTrack(track_list.head.musicNode);
	pauseTrack();
	playlist.index = 0;
}

function loadTrack(track_list) {
	// Clear the previous seek timer
	clearInterval(updateTimer);
	resetValues();

	// Load a new track
	curr_track.src = track_list.path;
	curr_track.load();

	// Update details of the track
	track_name.textContent = track_list.name;

	// Set an interval of 1000 milliseconds for updating the seek slider
	updateTimer = setInterval(seekUpdate, 1000);

	// Move to the next track if the current finishes playing using the 'ended' event
	curr_track.addEventListener("ended", nextTrack);

	//highlight whichever track is currently playing
	songHighlight(track_index);
}

function songHighlight(track_index) {
	document.querySelector(`#track-list li:nth-child(${track_index})`).classList.add("active");
	if (track_index - 1 != 0)
		document.querySelector(`#track-list li:nth-child(${track_index - 1})`).classList.remove("active");

	if (track_index + 1 <= 5)
		document.querySelector(`#track-list li:nth-child(${track_index + 1})`).classList.remove("active");
}

// Function to reset all values to their default
function resetValues() {
	curr_time.textContent = "00:00";
	total_duration.textContent = "00:00";
	seek_slider.value = 0;

	for (let i = 1; i <= 5; i++) {
		document.querySelector(`#track-list li:nth-child(${i})`).classList.remove("active");
	}
}

function playPauseTrack() {
	// Switch between playing and pausing depending on the current state
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
	// Go back to the first track if the current one is the last in the track list
	if (track_list.tempPos.next != null) {
		track_update = track_list.traverse(1);
		track_index++;
	} else {
		jumpTrack(0);
	}

	// Load and play the new track
	loadTrack(track_update);
	playTrack();
}

//jump to the track that was clicked
function jumpTrack(index) {
	track_update = track_list.get(index).musicNode;
	track_index = index + 1;
	loadTrack(track_update);
	playTrack();
}

function prevTrack() {
	// Go back to the last track if the current one is the first in the track list
	if (track_list.tempPos.prev != null) {
		track_update = track_list.traverse(-1);
		track_index--;
	} else {
		jumpTrack(4);
	}

	// Load and play the new track
	loadTrack(track_update);
	playTrack();
}
function seekTo() {
	// Calculate the seek position by the percentage of the seek slider
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

loadTrack(track_list.head.musicNode);
