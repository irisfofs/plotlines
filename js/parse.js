var apikey = '2094dd01fd7cbceb7e1bb916840e40e81f25d16f';
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

	var characters = {};
	var events = data.relations.map(function(rel, i) {
		var subjects = (rel.subject.entities || []).filter(takePeople).map(takeName);
		var objects  = (rel.object && rel.object.entities || []).filter(takePeople).map(takeName);
		subjects.forEach(function(person, i) {
			if (!(person in characters))
				characters[person] = { subjects: [], objects: [] };
			characters[person].subjects.push(i);
		});
		objects.forEach(function(person, i) {
			if (!(person in characters))
				characters[person] = { subjects: [], objects: [] };
			characters[person].objects.push(i);
		});
		document.write('<li title="' + rel.sentence + '">' + 
			'<span class="subject">' + rel.subject.text + '</span>' +
			' <span class="action">'  + rel.action.text  + '</span>' +
			(rel.object ? ' <span class="object">' + rel.object.text + '</span>' : '') + '</li>');
		return { subjects: subjects, objects: objects };
	});
	console.log(characters);
	console.log(events);
}

parse(mock);
