;(function(window, $) {
	var container = $('#goto-pleasenote');
	var button = $('#goto-pleasenote button');
	var sponsored = $('.pleasenote');
	var overlay = $('.pleasenote-overlay');
	button.on('click', function(){
		sponsored.toggleClass('pleasenote--visible');
	});
	overlay.on('click', function(){
		sponsored.removeClass('pleasenote--visible');
	});
	container.on('focusout', function(event){
		if(container.has(event.relatedTarget).length != 0) return;
		sponsored.removeClass('pleasenote--visible');
	});
})(window, jQuery);


/**
 * Track External
**/
;(function(window, $) {
	$(document).on('click', 'a[target="_blank"]', function(){
		if(typeof gtag === "undefined") return;
		gtag('event', '_blank', {
			'event_category' : 'click',
			'event_label' : $(this).attr('href')
		});
	});
	$(document).on('click', 'a[data-scrollto]', function(){
		if(typeof gtag === "undefined") return;
		gtag('event', 'scrollto', {
			'event_category' : 'click',
			'event_label' : $(this).attr('href')
		});
	});
})(window, jQuery);


/**
 * Scrollto
**/
;(function(window, $) {
	$(document).on('click', 'a[data-scrollto]', function(){
		var nav = $('#hostNavSticky .navSticky');
		var key = $(this).attr('href');
		var obj = $(key);
		if(obj.length < 1) return;
		$([document.documentElement, document.body]).animate({
			scrollTop: obj.offset().top - nav.height()
		}, 1000);
		return false;
	});
})(window, jQuery);


/**
 * Fancybox
**/
;(function(window, $) {
	$(document).on('afterShow.fb', function(e, instance, slide) {
		try{
			gtag('event', 'open', {
				'event_category': 'lightbox',
				'event_label': slide.src
			});
		}catch(e){}
	});
	$(document).on('afterClose.fb', function(e, instance, slide) {
		try{
			gtag('event', 'close', {
				'event_category': 'lightbox',
				'event_label': slide.src
			});
		}catch(e){}
		$('body').removeClass('compensate-for-scrollbar');
	});
	$(document).on('afterShow.fb', function(e, instance, slide) {
		$('.fancybox-content').append('<button type="button" title="Close" data-fancybox-close><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 10.6L6.6 5.2 5.2 6.6l5.4 5.4-5.4 5.4 1.4 1.4 5.4-5.4 5.4 5.4 1.4-1.4-5.4-5.4 5.4-5.4-1.4-1.4-5.4 5.4z"></path></svg></button>');
	});
})(window, jQuery);

;(function(window, $) {
	$(document).on('click', 'a[data-lightbox]', function(){
		var obj = $(this);
		var url = obj.attr('href');
		if(!url) return false;
		if(obj.is('[data-href]')) url = obj.attr('data-href');

		$.fancybox.close();
		$.fancybox.open({
			type: "iframe",
			src: url,
			baseClass: "fancybox-iframe--" + obj.attr('data-lightbox'),
			showCloseButton: false,
			touch: false
		});
		return false;
	});
})(window, jQuery);
