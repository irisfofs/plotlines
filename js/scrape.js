var headings = ['Plot', 'Synopsis', 'Plot summary', 'Summary'];

var base = 'http://en.wikipedia.org/wiki/';
// var base = 'http://en.wikipedia.org/w/api.php?action=query&export&format=json&callback=scrape';

function build_url(title) {
	return base + encodeURIComponent(title);
}
function get_html(title) {
	$.ajax({
		'dataType': 'xml',
		'url': 'server/wp.php',
		'success': scrape,
		'data': {
			'url': build_url(title)
		}
	});
}

function scrape(doc, status, xhr) {
	// window.doc = doc;
	$(doc).find('#Plot_summary').parent().nextUntil('h2');
}
get_html('To Kill a Mockingbird');
