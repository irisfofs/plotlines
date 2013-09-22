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

function scrape(article) {
	console.log(article);
}
get_html('To Kill a Mockingbird');

// function scraper() {
// 	// do all the scraping
// 	console.log($(body).text());
// 	return $(body).text();
// }

// console.log("Adding scraper");
// pjs.addScraper(build_url("To Kill a Mockingbird"), scraper);
// console.log("Scraper added");