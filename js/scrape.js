var headings = ['Plot', 'Synopsis', 'Plot summary', 'Summary'];
var h2s = headings.map(function(v) { return 'h2 span:contains("' + v + '")' }).join(', ');

var wikipedia_base = 'http://en.wikipedia.org/wiki/';

function build_wikipedia_url(title) {
	return wikipedia_base + encodeURIComponent(title);
}
function get_xml(title, succ) {
	$.ajax({
		'dataType': 'xml',
		'url': 'server/wp.php',
		'data': {
			'url': build_wikipedia_url(title)
		}
	}).done(function(a, b, c) {
		document.getElementById('title').className = 'onethird';
		succ(a, b, c);
	}).fail(function() {
		throw 'Could not retrieve text from Wikipedia';
	});
}

function scrape_wikipedia(xml) {
	// jQuery can be neat and stuff
	var heads = $(xml).find(h2s);
	if (!heads.length)
		throw "Synopsis not found"
	return heads.parent().nextUntil('h2').toArray().map(function (v) {
	    return v.textContent;
	}).join('\n');
}
