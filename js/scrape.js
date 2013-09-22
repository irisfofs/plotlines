var headings = ['Plot', 'Synopsis', 'Plot summary', 'Summary'];

var base = 'http://en.wikipedia.org/wiki/';
// var base = 'http://en.wikipedia.org/w/api.php?action=query&export&format=json&callback=scrape';

function build_url(title) {
	return base + encodeURIComponent(title);
}
function get_xml(title) {
	return $.ajax({
		'dataType': 'xml',
		'url': 'server/wp.php',
		'async': false,
		'data': {
			'url': build_url(title)
		}
	}).responseXML;
}

function scrape_wikipedia(title) {
	var h2s = headings.map(function(v) { return 'h2 span:contains(' + v + ')' }).join(', ');
	var doc = get_xml(title);

	return $(doc).find(h2s).parent().next('div').nextUntil('h2').toArray().map(function (v) {
	    return v.textContent;
	}).join('\n');
}

