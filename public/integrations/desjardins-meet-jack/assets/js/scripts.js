/* FORM */
;(function(window, $) {
	var html = $('html');
	$('#nav-button').on('click', function(){
		if(html.hasClass('is-nav')){
			html.removeClass('is-nav');
		}else{
			html.addClass('is-nav');
		}
		return false;
	});
	$('.nav-content a').on('click', function(){
		html.removeClass('is-nav');
	});
})(window, jQuery);

/* STORIES */
;(function(window, $) {
	var story = $('.story-image a');
	if(story.length < 1) return;
	var cache = new Array();

	story.on('mouseenter focus', function(){
		var obj = $(this);
		var preview = obj.find('.story-preview');
		var video = preview.find('video');
		var poster = preview.attr('data-poster');
		var url = preview.attr('data-url');
		video.remove();

		if(cache.indexOf(url)){
			var video = document.createElement('video');
			video.src = url;
			video.type = 'video/mp4';
			video.controls = false;
			video.loop = true;
			video.muted = true;
			video.autoplay = true;
			video.playsinline = true;
			preview.append(video);
		}else{
			var request = new XMLHttpRequest();
			request.onprogress = function(e) {
				if (!e.lengthComputable) return;
				console.log(e.loaded / e.total);
			};
			request.onerror = function(e) {
				console.log(e);
			};
			request.onload = function(){
				var video = document.createElement('video');
				video.src = url;
				video.type = 'video/mp4';
				video.controls = false;
				video.loop = true;
				video.muted = true;
				video.autoplay = true;
				video.playsinline = true;
				preview.append(video);
			};
			request.open('GET', url, true);
			request.send(null);
		}
	});
	story.on('mouseleave blur', function(){
		var preview = $(this).find('.story-preview');
		var video = preview.find('video');
		video.remove();
	});
})(window, jQuery);
