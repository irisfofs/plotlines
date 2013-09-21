var apikey = '90990619763d6298efa6b58ae6c57d6daa63a287';
var base = 'http://access.alchemyapi.com/';
var endpoints = {
	'relations': 'calls/text/TextGetRelations'
};

function build_url(endpoint, params) {
	params = params || {};
	params['apikey'] = apikey;

	params_ = [];
	for (var k in params)
		params_.push(encodeURIComponent(k) + '=' + encodeURIComponent(params[k]));

	return base + endpoints[endpoint] + '?' + params_.join('&');
}

function relations(text) {
	return $.ajax({
		'dataType': 'jsonp json',
		'url': build_url('relations'),
		'jsonpCallback': 'parse',

		'data': {
			'text': text,
			'outputMode': 'json',
			'jsonp': 'parse',
			'entities': '1',
			'requireEntities': '1'
		}
	});
}

function takePeople(entity) {
	return entity.type === 'Person';
}
function takeName(entity) {
	return entity.text;
}
function parse(data) {
	console.log(data.relations);
	data.relations.map(function(rel, i) {
		console.log(i,
					(rel.subject.entities || []).filter(takePeople).map(takeName),
					(rel.object && rel.object.entities || []).filter(takePeople).map(takeName))
	});
}

parse(mock);
