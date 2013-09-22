var headings = ['Plot', 'Synopsis', 'Plot summary', 'Summary'];
var h2s = headings.map(function(v) { return 'h2 span:contains("' + v + '")' }).join(', ');

var wikipedia_base = 'http://en.wikipedia.org/wiki/';
// var base = 'http://en.wikipedia.org/w/api.php?action=query&export&format=json&callback=scrape';

function build_wikipedia_url(title) {
	return wikipedia_base + encodeURIComponent(title);
}
function get_xml(title) {
	return $.ajax({
		'dataType': 'xml',
		'url': 'server/wp.php',
		'async': false,
		'data': {
			'url': build_wikipedia_url(title)
		}
	}).responseXML;
}

function scrape_wikipedia(title) {
	var doc = get_xml(title);
	window.doc = doc;

	return $(doc).find(h2s).parent().nextUntil('h2').toArray().map(function (v) {
	    return v.textContent;
	}).join('\n');
}
