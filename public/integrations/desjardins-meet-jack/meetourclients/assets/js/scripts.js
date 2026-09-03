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
;(function(window, $) {
	var animating = $('.animating');
	if(animating.length < 1) return;
	
	var heading = $('#goto-heading');
	var animating = $('.animating');
	var i = 0;
	var timer = setInterval(function(){
		++i;
		if(i > animating.length - 1) i = 0;
		heading.attr('data-index', i);
	}, 5000);

})(window, jQuery);
