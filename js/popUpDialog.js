define(['jquery', 'bootstrap','renderChart','spinner'], function($,bs,renderChart,spinner){

	var target = document.getElementById('spinner');
 	var option = {
		  lines: 9, // The number of lines to draw
		  length: 16, // The length of each line
		  width: 11, // The line thickness
		  radius: 32, // The radius of the inner circle
		  corners: 0.8, // Corner roundness (0..1)
		  rotate: 0, // The rotation offset
		  direction: 1, // 1: clockwise, -1: counterclockwise
		  color: '#fff', // #rgb or #rrggbb or array of colors
		  speed: 1.8, // Rounds per second
		  trail: 41, // Afterglow percentage
		  shadow: false, // Whether to render a shadow
		  hwaccel: false, // Whether to use hardware acceleration
		  className: 'spinner', // The CSS class to assign to the spinner
		  zIndex: 2e9, // The z-index (defaults to 2000000000)
	};
	var progressDialog = new spinner(option);

	var $modal = $(".modal");
			$modalTiltle = $(".modal-title"),
			$modalBody	 = $(".modal-body"),
			$modalFooter = $(".modal-footer");
			$modalImage  = $("#modal-image");
			$spinner	 = $("#spinner");
	var popUpDialog = function(url){
		popUpDialog.clear();
		$modalTiltle.html("");
		$modal.modal("show");
		$modalImage.hide();
		$spinner.show();
		progressDialog.spin(target);
		setTimeout(function(){
			
			$.ajax({
				url: url,
				type: 'GET',
			})
			.done(function(json) {
				popUpDialog.renderJson(json);
			})
			.fail(function() {
				return Error;
			});	

		},1500);
		
	}

	popUpDialog.renderJson = function(json){

		$modalTiltle.html(json.name);
		$modalImage.attr('src',json.imgUrl);
		$modalImage.show();
		var aspect = [];
		
		var object = {
			title : "screen",
			posCount : json.aspectSentiment.screen[0],
			negCount : json.aspectSentiment.screen[1],
		}
		aspect.push(object);
		var object = {
			title : "battery",
			posCount : json.aspectSentiment.battery[0],
			negCount : json.aspectSentiment.battery[1],
		}
		aspect.push(object);
		var object = {
			title : "camera",
			posCount : json.aspectSentiment.camera[0],
			negCount : json.aspectSentiment.camera[1],
		}
		aspect.push(object);
		// $.each(json.aspectSentiment, function(i, value){
		// 	var object = {
		// 		title : value.aspect,
		// 		posCount : value.sentimentList[0].totalCount,
		// 		negCount : value.sentimentList[1].totalCount,
		// 		posComt  : popUpDialog.parseSentimentCommentToList("POSITIVE &nbsp;&nbsp; ABOUT &nbsp;&nbsp; " + value.aspect.toUpperCase(),value.sentimentList[0].summaries),
		// 		negComt  : popUpDialog.parseSentimentCommentToList("NEGATIVE &nbsp;&nbsp; ABOUT &nbsp;&nbsp; " + value.aspect.toUpperCase(),value.sentimentList[1].summaries)
		// 	}
		// 	aspect[i] = object;
		// });
		
		renderChart(aspect);
		setTimeout(function(){
			progressDialog.stop();
			$spinner.hide();
		},1000);
	}

	popUpDialog.parseSentimentCommentToList = function(type, array){
		var html = "<ul>" + type + " :" ;
		$.each(array,function(index, value){
			html += "<li>" + value + "</li>"
		});
		html += "</ul>"

		return html;
	}

	popUpDialog.clear = function(){
		$("#chart").empty();
	}

	return popUpDialog;
});