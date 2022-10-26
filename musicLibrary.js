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
 */

let albums = [
	{
		album_name: "",
		img: "",
	},
];

let isPlaying = true;

function switchImg(num) {
	switch (num) {
		case 1:
			document.getElementById("cover").src = "./images/curious_village.jpg";
			break;
		case 2:
			document.getElementById("cover").src = "./images/diabolical_box.jpg";
			break;
		case 3:
			document.getElementById("cover").src = "./images/unwound_future.jpg";
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
