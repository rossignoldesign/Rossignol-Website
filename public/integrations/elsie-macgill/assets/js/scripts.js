;(function(window, $) {
	var html = $('html');
	var nav_button = $('#nav-button');
	var nav_container = $('#nav-container');
	nav_button.on('click', function(){
		if(nav_button.attr('aria-expanded') === 'true'){
			nav_button.attr('aria-expanded', 'false');
			nav_container.attr('aria-hidden', 'true');
		}else{
			nav_button.attr('aria-expanded', 'true');
			nav_container.attr('aria-hidden', 'false');
		}
		return false;
	});
})(window, jQuery);
;(function(window, $) {
	var goto = $('#goto-timeline');
	var date = $('#goto-timeline .date');
	var container = $('#goto-timeline .timeline-containerinner');
	var current = goto.attr('data-i');
	goto.on('timeline', function(){
		date.removeClass('date--current date--pp date--p date--n date--nn');
		date.eq(current).addClass('date--current');
		date.eq(current-1).addClass('date--p');
		date.eq(current-2).addClass('date--pp');
		date.eq(current+1).addClass('date--n');
		date.eq(current+2).addClass('date--nn');
	});
	$(document).on('click', 'button[data-direction="prev"]', function(){
		if(--current < 0) current = 0;
		goto.attr('data-i', current);
		goto.trigger('timeline');
		return false;
	});
	$(document).on('click', 'button[data-direction="next"]', function(){
		if(++current >= date.length) current = date.length - 1;
		goto.attr('data-i', current);
		goto.trigger('timeline');
		return false;
	});
})(window, jQuery);

;(function(window, $) {
	$(document).on('click', 'a[data-playinline]', function(){
		var obj = $(this);
		var parent = obj.parent();
		parent.html('<iframe src="' + obj.attr('href') + '" allowfullscreen="allowfullscreen" allow="autoplay; fullscreen" ></iframe>');
		return false;
	});
})(window, jQuery);
/**/

;(function(window, $) {
	var reveals = $('[data-reveal]');
	if(reveals.length < 1) return;
	$(window).scroll(function (event) {
		var scroll = $(window).scrollTop();
		var treshold = scroll + ($(window).height() * .75);
		reveals.each(function(){
			if(treshold > $(this).offset().top){
				$(this).addClass('reveal--seen');
			}
			if(treshold > $(this).offset().top){
				$(this).addClass('reveal--intersecting');
			}else{
				$(this).removeClass('reveal--intersecting');
			}
		})
	}).trigger('scroll');
})(window, jQuery);


;(function(window, $) {
	var html = $('html');
	var start = $('#animate');
	var scrollmagic = $('#scrollmagic');
	var animates = $('[data-scrollmagic]');
	if(start.length < 1) return;
	$(window).on('scroll', function(){
		var y = window.pageYOffset - start.offset().top + ($(window).height() / 2);
		if(y < 0) y = 0;
		var t = y / (start.offset().top + start.height());
		if(t > 1) t = 1;
		if(t > 0){
			start.addClass('is-started');
		}else{
			start.removeClass('is-started');
		}
		if(t == 1){
			start.addClass('is-ended');
		}else{
			start.removeClass('is-ended');
		}
		scrollmagic.val(t*100);
		html.attr('data-animation', t*100);
		animates.each(function(){
			var obj = $(this);
			var os = parseFloat(obj.attr('data-delay'));
			if(!os) os = 0;
			var d = ((t * 1) - os);
			if(d == 1) d -= 0.00000001;
			obj.css('animation-delay',  0 - d  + 's');
		});
	}).trigger('scroll');

	$(window).on('resize', function(){
		start = $('#animate');
	}).trigger('scroll');
	/**/
})(window, jQuery);
