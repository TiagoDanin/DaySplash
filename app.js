const fs = require('fs')
const format = require('jformat')
const unsplash = require('unsplash-source-node')
const request = require('request-promise-native')

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
		transform: function (body, response, resolveWithFullResponse) {
			return response.request.uri.href, "data:" + response.headers["content-type"] + ";base64," + new Buffer(body, 'binary').toString('base64');
		}
	})
	return data
}

async function loadWallpaper(page) {
	var img = await getIMG(unsplash({random: true, width:100, height: 100}))
	var div = document.createElement('div')
	var name = 'card_wallpaper'
	var temp = await (fs.readFileSync(`template/${name}.html`)).toString()
	var html = temp.format({img: img})
	div.innerHTML = html
	page.querySelector('#wallpapers_cards').appendChild(div)
	page.querySelector(`#wallpaper_set`).onclick = function() {
		notification('test');
	};
	page.querySelector(`#wallpaper_download`).onclick = function() {
		notification('test');
	};
}
