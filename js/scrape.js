var headings = ['Plot', 'Synopsis', 'Plot summary', 'Summary'];

//var base = 'http://en.wikipedia.org/wiki/';
var base = 'http://en.wikipedia.org/w/api.php?action=query&export&format=json&callback=scrape';

function build_url(title) {
	return base + '&titles=' + encodeURIComponent(title);
}
function get_html(title) {
	$.ajax({
		'dataType': 'jsonp json',
		'url': build_url(title),
		'jsonpCallback': 'scrape'
	});
}

function scrape(article) {
	console.log(article.query.export['*']);
}
get_html('Andrew');
