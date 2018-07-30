(function($, root) {
	$scope = $('.scope');
	function renderList (data) {
		var htmlStr = "";
		for(var i = 0; i < data.length; i++){
			htmlStr += '<li class="list-item">\
					<span class="list-song-name"> ' + data[i].song + '</span>\
					<span class="list-songer-name">-' + data[i].singer + '</span>\
				</li>';
		}
		$scope.find('.list-box').html(htmlStr);
	}

	

	root.renderList = renderList;
})(window.Zepto, window.player || (window.player = {}));