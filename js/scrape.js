var headings = ['Plot', 'Synopsis', 'Plot summary', 'Summary'];
var h2s = headings.map(function(v) { return 'h2 span:contains("' + v + '")' }).join(', ');

var wikipedia_base = 'http://en.wikipedia.org/wiki/';

function build_wikipedia_url(title) {
	return wikipedia_base + encodeURIComponent(title);
}
function get_xml(title) {
	var xml = $.ajax({
		'dataType': 'xml',
		'url': 'server/wp.php',
		'async': false,
		'data': {
			'url': build_wikipedia_url(title)
		}
	}).responseXML;
	if (typeof xml === 'undefined')
		throw 'Could not retrieve text from Wikipedia';
	document.getElementById('title').className = 'onethird';
	return xml;
}

function scrape_wikipedia(title) {
	var doc = get_xml(title);
	window.doc = doc;

	// jQuery can be neat and stuff
	var heads = $(doc).find(h2s);
	if (!heads.length)
		throw "Synopsis not found"
	return heads.parent().nextUntil('h2').toArray().map(function (v) {
	    return v.textContent;
	}).join('\n');
}
