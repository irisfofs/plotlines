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

	var people = {};
	var rel_people = data.relations.map(function(rel, i) {
		var subjects = (rel.subject.entities || []).filter(takePeople).map(takeName);
		var objects  = (rel.object && rel.object.entities || []).filter(takePeople).map(takeName);
		subjects.forEach(function(person, i) {
			if (!(person in people))
				people[person] = { subjects: [], objects: [] };
			people[person].subjects.push(i);
		});
		objects.forEach(function(person, i) {
			if (!(person in people))
				people[person] = { subjects: [], objects: [] };
			people[person].objects.push(i);
		});
		return { subjects: subjects, objects: objects };
	});

	var t = '<table><thead><tr><th>Relation</th>';
	for (person in people)
		t += '<th><div class="up"><span>' + person + '</span></div></th>';
	t += '</tr></thead><tbody>';
	rel_people.forEach(function(rel, i) {
		data.relations[i]
		t += '<tr><td title="' + data.relations[i].sentence + '">' +
			'<span class="subject">' + data.relations[i].subject.text + '</span>' +
			' <span class="action">'  + data.relations[i].action.text  + '</span>' +
			(data.relations[i].object ? ' <span class="object">' + data.relations[i].object.text + '</span>' : '') + '</td>';
		for (person in people) {
			t += '<td>';
			if (-1 !== rel.subjects.indexOf(person))
				t += 's';
			if (-1 !== rel.objects.indexOf(person))
				t += 'o';
			t += '</td>';
		}
	});
	t += '</tbody></table>';
	document.write(t);
}

parse(mock);
