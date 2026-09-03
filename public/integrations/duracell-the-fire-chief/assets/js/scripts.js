/* FIXED */
;(function(window, $) {
	$('#goto-video .video a').on('click', function(){
		var container =$('#goto-video .video');
		container.html('<iframe src="' + $(this).attr('href') + '"></iframe>')
		if(typeof gtag === "undefined") return false;
		gtag('event', 'Play', {
			'event_category' : 'Video',
			'event_label' : $(this).attr('href')
		});
		return false;
	});
})(window, jQuery);



/* QUIZ */
;(function(window, $) {
	var gotoquiz = $('#goto-quiz');
	var gotoscore = $('#goto-score');
	var gotosentiment = $('#goto-sentiment');
	var current = gotoquiz.attr('data-q');
	var score = 0;
	$('.card-options input').on('change', function(){
		var card = $(this).parents('.card');
		var options = card.find('.card-options');
		var answer = card.find('.card-answer');
		options.slideUp();
		answer.slideDown();

		var is = $(this).attr('data-is');
		if(is) gotoscore.html(++score);


		if(score > 3){
			gotosentiment.html('Great work!');
		}else{
			gotosentiment.html('Great effort!');
		}

		if(typeof gtag === "undefined") return false;
		gtag('event', card.attr('id'), {
			'event_category' : 'Quiz',
			'event_label' : $(this).val()
		});

		return false;
	});
	$('.answer-next button').on('click', function(){
		gotoquiz.attr('data-q', ++current);

		if(typeof gtag === "undefined") return false;
		gtag('event', 'click next', {
			'event_category' : 'Quiz',
			'event_label' : current
		});

		if(current < 8) return false;
		gtag('event', 'Score', {
			'event_category' : 'Quiz',
			'event_label' : score
		});

		return false;
	});
})(window, jQuery);
