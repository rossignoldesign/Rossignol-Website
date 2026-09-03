;(function(window, $) {
	serialize = function(obj) {
		var str = [];
		for (var p in obj)
			if (obj.hasOwnProperty(p)) {
				str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
			}
		return str.join("&");
	};

	share_tracker = function(t, l){
		if(typeof gtag === "undefined") return;
		gtag('event', t, {
			'event_category' : 'share',
			'event_label' : l
		});
	};


	// Click event on Share Button
	$(document).on('click', '.share button, .sharethis button', function(){
		var button = $(this);
		var type = button.attr('data-type');
		var url = button.attr('data-url');
		var title = button.attr('data-title');
		var description = button.attr('data-description');
		var image = button.attr('data-image');
		if(typeof url == "undefined") url = $('meta[property="og:url"]').attr('content');
		if(typeof url == "undefined") url = window.location.href;
		if(typeof title == "undefined") title = $('meta[property="og:title"]').attr('content');
		if(typeof title == "undefined") title = $('title').text();
		if(typeof description == "undefined") description = $('meta[name="description"]').attr('content');
		if(typeof description == "undefined") description = '';
		if(typeof image == "undefined") image = $('meta[property="og:image"]').attr('content');
		if(typeof image == "undefined") image = '';

		// Generate Link
		var link;
		switch(type){
			case 'buffer': link = 'http://bufferapp.com/add?' + serialize({'url' : url, 'text' : title}); break;
			case 'delicious': link = 'https://delicious.com/save?' + serialize({'v' : 5, 'jump' : 'close', 'url' : url, 'text' : title}); break;
			case 'digg': link = 'http://digg.com/submit?' + serialize({'url' : url, 'title' : title}); break;
			case 'facebook': link = 'https://www.facebook.com/sharer/sharer.php?' + serialize({'u' : url, 'quote' : title}); break;
			case 'googleplus': link = 'https://plus.google.com/share?' + serialize({'url' : url}); break;
			case 'linkedin': link = 'http://www.linkedin.com/shareArticle?' + serialize({'mini' : 'true', 'url' : url, 'title' : title}); break;
			case 'mailto': link = 'mailto:?' + serialize({'subject' : title, 'body': "Bonjour,\n\nVous pourriez être intéressé par ce lien:\n" + url}); break;
			case 'radiocanada': link = 'http://api.radio-canada.ca/partage/v2/Email?' + serialize({'url' : url, 'title' : title}); break;
			case 'pinterest': link = 'http://pinterest.com/pin/create/button/?' + serialize({'url' : url, 'media' : image, 'description' : title}); break;
			case 'reddit': link = 'http://reddit.com/submit?' + serialize({'url' : url, 'title' : title}); break;
			case 'stumbleupon': link = 'https://mix.com/add?' + serialize({'url' : url, 'title' : title}); break;
			case 'tumblr': link = 'http://www.tumblr.com/share/link?' + serialize({'url' : url, 'name' : title, 'description' : description}); break;
			case 'twitter': link = 'https://twitter.com/intent/tweet?' + serialize({'url' : url, 'text' : title}); break;
			default:
				alert('data-type on link is not specified. please contact the webmaster.');
				return false;
			break;
		}

		// Track Event in Google Analytics
		share_tracker(type, link);

		// Show popup
		switch(type){
			case 'mailto':
				window.location.href = link;
			break;
			default:
				window.open(
					link,button.attr('title'),
					"menubar=no, status=no, scrollbars=no, menubar=no, width=558, height=558"
				);
			break;
		}

		return false;
	});


})(window, jQuery)
/**/
