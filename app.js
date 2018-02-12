const fs = require('fs')
const format = require('jformat')
const unsplash = require('unsplash-source-node')
const request = require('request-promise-native')

function editSelects(event) {
	document.getElementById('choose-sel').removeAttribute('modifier');
	if (event.target.value == 'material' || event.target.value == 'underbar') {
		document.getElementById('choose-sel').setAttribute('modifier', event.target.value);
	}
}

document.addEventListener('init', function(event) {
	var page = event.target
	console.log(page)
	if (page.matches('#wallpaper')) {
		loadWallpaper(page)
	}
});

function notification(text) {
	ons.notification.alert(text)
}

async function getIMG(url) {
	var data = await request({
		uri: url,
		encoding: null,
		transform: function(body, response, resolveWithFullResponse) {
			return "data:" + response.headers["content-type"] + ";base64," + new Buffer(body, 'binary').toString('base64');
		}
	})
	return data
}

async function loading(page) {
	var name = 'loading'
	var temp = await (fs.readFileSync(`template/${name}.html`)).toString()
	var html = temp.format({
		name: 'Loading...'
	})
	page.querySelector('#wallpapers_cards').innerHTML = html
}

async function loadWallpaper(page) {
	loading(page)
	page.querySelector(`#wallpaper_set`).onclick = function() {
		notification('test');
	};
	page.querySelector(`#wallpaper_download`).onclick = function() {
		notification('test');
	};
	page.querySelector(`#wallpaper_reload`).onclick = function() {
		loading(page);
		loadWallpaper(page);
	};
	var img = await getIMG(unsplash({
		random: true,
		width: 1366,
		height: 768
	}))
	var name = 'card_wallpaper'
	var temp = await (fs.readFileSync(`template/${name}.html`)).toString()
	var html = temp.format({
		img: img
	})
	page.querySelector('#wallpapers_cards').innerHTML = html
}
