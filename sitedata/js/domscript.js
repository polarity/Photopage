var app = {
	image: {
		count: 0,
		all: {},
		current: 0,
	},
	interval: 50000,
	timer:0,
	updateBg: function() {

		// Timer anhalten
		clearInterval(app.timer)

		// Image preloaden
		var i = app.image.all[app.image.current]
		var preload_image = new Image()

		preload_image.src = 'http://farm'+i.farm+'.static.flickr.com/'+i.server+'/'+i.id+'_'+i.secret+'_b.jpg'
		$("#ssLogo").append(' <span id="loading">... loading next point</span>')

		// Warten bis das Bild geladen ist
		preload_image.onload = function(){
			$('#loading').remove()

			// Altes Bild ausfaden
			$('img#ssBg').fadeOut('slow',function(){
				// Bild ersetzen
				$(this).attr('src',preload_image.src)
				// Anpassen
				app.resz()
				// Neues einfaden
				$(this).fadeIn('slow')
				// Url ändern
				document.location.hash = '#'+i.id
			})

			// nächstes
			if(app.image.current < (app.image.count-1)){
				app.image.current++
			} else {
				app.image.current = 1
			}

			// Timer timen
			app.timer = setInterval("app.updateBg()",app.interval)
		}
	},
	resz: function() {
		var width = $(window).width();
		var height = $(window).height();

		var imwidth = $('#ssBg').width();
		var imheight = $('#ssBg').height();

		var over = imwidth / imheight;
		var under = imheight / imwidth;
		if((width / height) >=over)
		{
			$('#ssBg').css({'width':width,'height':under*width});
		}
		else
		{
			$('#ssBg').css({'width':over*height,'height':height});
		}
	}
}

jsonFlickrApi = function(data){
	app.image.count = data.photos.photo.count()
	app.image.all = data.photos.photo
	app.updateBg() // start
}

// Event
$(window).resize(function(){
	app.resz();
})

// Event
$(document).ready(function() {

	$.ajax({
		dataType:"jsonp",
		url: 'http://api.flickr.com/services/rest/\
		?format=json\
		&method=flickr.photos.search\
		&user_id=55807530@N00\
		&tags=\
		&tag_mode=all\
		&api_key=816350be5a7f8f0a4702284866ba5692'
	})

	app.resz()

});

// Javascript Objekt Zähl Hilfe
Object.prototype.count = function(){
	var count = 0;
	for (var k in this) {
		if (this.hasOwnProperty(k)) {
			++count;
		}
	}
	return count
}

var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-1374159-3']);
_gaq.push(['_trackPageview']);

(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();