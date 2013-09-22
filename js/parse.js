var apikey = '2094dd01fd7cbceb7e1bb916840e40e81f25d16f';
var alchemy_base = 'http://access.alchemyapi.com/';
var endpoints = {
	'relations': 'calls/text/TextGetRelations'
};

function build_alchemy_url(endpoint, params) {
	params = params || {};
	params['apikey'] = apikey;

	params_ = [];
	for (var k in params)
		params_.push(encodeURIComponent(k) + '=' + encodeURIComponent(params[k]));

	return alchemy_base + endpoints[endpoint] + '?' + params_.join('&');
}

function relations(text) {
	return $.ajax({
		'dataType': 'jsonp json',
		'url': build_alchemy_url('relations'),
		'jsonpCallback': 'parse',
		'async': false,

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

	var sentences = [];
	data.relations.forEach(function(rel, i) {
		var sentence = rel.sentence;
		if (!sentences.length || sentence !== sentences[sentences.length - 1].sentence)
			sentences.push({ sentence: sentence, relations: [ i ] });
		else
			sentences[sentences.length - 1].relations.push(i);
	});

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

	var t = '<table class="sentences"><thead><tr><th>Sentence</th><th>Relation</th>';
	for (person in people)
		t += '<th><div class="up"><span>' + person + '</span></div></th>';
	t += '</tr></thead><tbody>';

	var cols = 2 + Object.keys(people).length;
	sentences.forEach(function(sentence, s) {
		t += '<tr><td colspan="2"><u>' + sentence.sentence + '</u></td></tr>';
		sentence.relations.forEach(function(r) {
			var rel = data.relations[r];
			var rel_person = rel_people[r];

			var subject = rel.subject.text;
			if (rel.subject.entities)
				rel.subject.entities.forEach(function(entity) {
					subject = subject.replace(entity.text, '<abbr title="' + entity.text + '">' + entity.text + '</abbr>');
				});

			t += '<tr><td></td><td>' +
				'<span class="subject">' + subject + '</span>' +
				' <span class="action">'  + rel.action.text  + '</span>' +
				(rel.object ? ' <span class="object">' + rel.object.text + '</span>' : '') + '</td>';
			for (person in people) {
				t += '<td>';
				if (-1 !== rel_person.subjects.indexOf(person))
					t += '◆';
				if (-1 !== rel_person.objects.indexOf(person))
					t += '◇';
				t += '</td>';
			}
		});
	});
	t += '</tbody></table>';
	document.getElementById('t').innerHTML = t;
}
