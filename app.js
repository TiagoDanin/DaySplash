const fs = require('fs')
const format = require('jformat')
const unsplash = require('unsplash-source-node')
const request = require('request-promise-native')
const {dialog, session} = require('electron').remote
const wallpaper = require('wallpaper')
const tmpdir = require('os-tmpdir')
const jsonfile = require('jsonfile')

const fileConfig = `config.json`
var config = jsonfile.readFileSync(fileConfig)


function editSelects(event) {
	document.getElementById('choose-sel').removeAttribute('modifier')
	if (event.target.value == 'material' || event.target.value == 'underbar') {
		document.getElementById('choose-sel').setAttribute('modifier', event.target.value)
	}
}

document.addEventListener('init', function(event) {
	var page = event.target
	console.log(page)
	if (page.matches('#wallpaper')) {
		loadWallpaper(page)
	} else if (page.matches('#setting')) {
		loadSetting(page)
	}
})

function notification(text) {
	ons.notification.alert(text)
}

function wallpaperSet(img) {
	var content = img.base
	var ext = (img.type).replace('image/', '')
	var filePath = `${tmpdir()}/DaySplash.${ext}`
	fs.writeFile(filePath, content, (err) => {
		if (!err) {
			wallpaper.set(filePath).then(() => {
				notification('Successfully!')
			})
		}
	})
}

function wallpaperDownload(img) {
	var content = img.base
	var ext = (img.type).replace('image/', '')
	var fileName = `Wallpaper.${ext}`
	dialog.showSaveDialog({
		title: 'Download Wallpaper',
		defaultPath: fileName
	}, function (filePath) {
		if (filePath) {
			fs.writeFile(filePath, content, (err) => {
				if (!err) {
					notification('Donwload successfully!')
				}
			})
		}
	})
}

async function getIMG(url) {
	console.log(url)
	var data = await request({
		uri: url,
		encoding: null,
		transform: function(body, response, resolveWithFullResponse) {
			var param = {}
			param.base64 = "data:" + response.headers["content-type"] + ";base64," + new Buffer(body, 'binary').toString('base64')
			param.base = body
			param.type = response.headers["content-type"]
			return param
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
	page.querySelector(`#wallpaper_reload`).onclick = function() {
		loading(page)
		loadWallpaper(page)
	}
	var img = await getIMG(unsplash({
		search: config.tags,
		width: config.width,
		height: config.height
	}))
	page.querySelector(`#wallpaper_set`).onclick = function() {
		wallpaperSet(img)
	}
	page.querySelector(`#wallpaper_download`).onclick = function() {
		wallpaperDownload(img)
	}
	var name = 'card_wallpaper'
	var temp = await (fs.readFileSync(`template/${name}.html`)).toString()
	var html = temp.format({
		img: img.base64
	})
	page.querySelector('#wallpapers_cards').innerHTML = html
}

async function loadSetting(page) {
	page.querySelector(`#setting_set`).onclick = function() {
		config.width  = document.getElementById('width').value  || config.width  || '1366'
		config.height = document.getElementById('height').value || config.height || '768'
		config.tags   = document.getElementById('tags').value   || config.tags   || 'Blur'
		console.log(config)
		jsonfile.writeFileSync(
			fileConfig,
			config,
			{
				replacer: true
			}
		)
		notification('Successfully!')
	}
}
