var app = {
	config: {
		api_key: "816350be5a7f8f0a4702284866ba5692",
		format: "json",
		user_id: "55807530@N00",
		apiurl: "https://api.flickr.com/services/rest/"
	},
	image: {
		count: 0,
		all: {},
		current: 0,
		obj: {}
	},
	interval: 50000,
	timer: 0,
	model: {
		getAll: function(callback) {
			$.ajax({
				dataType: "json",
				url: app.config.apiurl + '?method=flickr.photos.search&format=' + app.config.format + '&user_id=' + app.config.user_id + '&api_key=' + app.config.api_key + '&nojsoncallback=1',
				success: function(data) {
					if (typeof callback == 'function') {
						app.image.all = data.photos.photo;
						app.image.count = data.photos.photo.count();
						callback(data);
					}
				}
			});
		}
	},
	controller: {
		// Home Controller
		home: function() {
			// Erstmal alle Bilder holen und das erste anzeigen
			app.model.getAll(function(data) {
				app.image.all = data.photos.photo;
				app.helper.updateBg();
			});
		},
		// Controller für Aufruf der Seite mit einer ID
		picwithid: function() {
			// Erstmal alle Bilder holen und das erste anzeigen
			app.model.getAll(function(data) {
				app.image.all = data.photos.photo;
				app.helper.takehash();
			});
		}
	},
	helper: {
		updateBg: function(callback) {
			// Image preloaden
			var i = app.image.all[app.image.current];
			app.image.obj = new Image();
			app.image.obj.src = 'http://farm' + i.farm + '.static.flickr.com/' + i.server + '/' + i.id + '_' + i.secret + '_b.jpg';
			$("#ssLogo").append(' <span id="loading">... loading next image</span>');

			// Warten bis das Bild geladen ist
			app.image.obj.onload = function() {
				$('#loading').remove();

				// Altes Bild ausfaden
				$('img#ssBg').fadeOut('slow', function() {

					// Bild ersetzen
					$(this).attr('src', app.image.obj.src);

					// Anpassen
					app.helper.resz();

					// Neues einfaden
					$(this).fadeIn('slow');

					// Url ändern
					// document.location.hash = '#'+i.id

				});

				// Callback ausführen
				if (typeof (callback) == 'function') {
					callback();
				}

			};
		},
		diashow: function() {
			// Timer anhalten
			clearInterval(app.timer);
			// Nächstes Bild bitte
			app.helper.next();
			// Timer timen
			app.timer = setInterval("app.helper.diashow()", app.interval);
		},
		resz: function() {
			var width = $(window).width();
			var height = $(window).height();
			var imwidth = app.image.obj.width;
			var imheight = app.image.obj.height;
			var over = imwidth / imheight;
			var under = imheight / imwidth;
			if ((width / height) >= over) {
				var newheight = under * width;
				var newwidth = width;
			} else {
				var newheight = height;
				var newwidth = over * height;
			}
			$('#ssBg').css({
				'width': newwidth,
				'height': newheight
			});
			if (height < newheight) {
				$('#ssBg').css({
					top: -((newheight - height) / 2)
				});
			} else {
				$('#ssBg').css({
					top: 0
				});
			}
			if (width < newwidth) {
				$('#ssBg').css({
					left: -((newwidth - width) / 2)
				});
			} else {
				$('#ssBg').css({
					left: 0
				});
			}
		},
		prev: function() {
			// vorhergehendes
			if (app.image.current > 0) {
				app.image.current = app.image.current - 1;
			} else {
				app.image.current = (parseInt(app.image.count) - 1);
			}
			document.location.hash = app.image.all[app.image.current].id;
		},
		next: function(callback) {
			// nächstes
			if (app.image.current < (app.image.count - 1)) {
				app.image.current = (parseInt(app.image.current) + 1);
			} else {
				app.image.current = 0;
			}
			document.location.hash = app.image.all[app.image.current].id;
		},
		checkhash: function() {
			if (document.location.hash) {
				for (var k in app.image.all) {
					if (app.image.all[k].id == document.location.hash.substr(1)) {
						app.image.current = k;
					}
				}
			}
		},
		takehash: function() {
			app.helper.checkhash();
			app.helper.updateBg();
		},
		events: function() {
			// Event: wenn Fenster Größe geändert wird!
			$(window).resize(function() {
				app.helper.resz();
			});

			// Event wenn Hash geändert wird
			window.onhashchange = app.helper.takehash;

			// Navigation
			$('#ssApp_next').bind('click', app.helper.next);
			$('#ssApp_prev').bind('click', app.helper.prev);
			$('#ssApp_play').bind('click', app.helper.diashow);
		},
		facebook_like: function() {
			var i = app.image.all[app.image.current];
			$('meta#title').attr('content', i.title);
			$('meta#image').attr('content', 'http://farm' + i.farm + '.static.flickr.com/' + i.server + '/' + i.id + '_' + i.secret + '_s.jpg');
			$('meta#url').attr('content', document.location);
			$('meta#site_name').attr('content', $("title").text());
			$('meta#title').attr('content', i.title);
			$('meta#description').attr('content', 'Keine Beschreibung da!');
		}
	}
};


// Event
$(document).ready(function() {

	// Events init
	app.helper.events();

	// Bootstrap
	if (document.location.hash) {
		app.controller.picwithid();
	} else {
		// Ablauf an Controller übergeben
		app.controller.home();
	}

});

// Javascript Objekt Zähl Hilfe
Object.prototype.count = function() {
	var count = 0;
	for (var k in this) {
		if (this.hasOwnProperty(k)) {
			++count;
		}
	}
	return count;
};
