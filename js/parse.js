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
	var json = $.ajax({
		'type': 'POST',
		'dataType': 'json',
		'url': 'server/al.php',
		'async': false,

		'data': {
			'url': build_alchemy_url('relations'),
			'text': text,
			'outputMode': 'json',
			'entities': '1',
			'requireEntities': '1'
		}
	}).responseJSON;
	if (typeof json === 'undefined')
		throw 'Could not retrieve relations from Alchemy API';
	document.getElementById('title').className = 'twothirds';
	return json;
}

function takePeople(entity) {
	return entity.type === 'Person';
}
function takeName(entity) {
	return entity.text;
}
function parse(data) {
	var sentences = [];
	data.relations.forEach(function(rel, i) {
		var sentence = rel.sentence;
		if (!sentences.length || sentence !== sentences[sentences.length - 1].sentence)
			sentences.push({ sentence: sentence, relations: [ i ] });
		else
			sentences[sentences.length - 1].relations.push(i);
	});

	var people = {};
	var rel_people = data.relations.map(function(rel, r) {
		var subjects = (rel.subject.entities || []).filter(takePeople).map(takeName);
		var objects  = (rel.object && rel.object.entities || []).filter(takePeople).map(takeName);
		subjects.forEach(function(person, i) {
			if (!(person in people))
				people[person] = { subjects: [], objects: [] };
			people[person].subjects.push(r);
		});
		objects.forEach(function(person, i) {
			if (!(person in people))
				people[person] = { subjects: [], objects: [] };
			people[person].objects.push(r);
		});
		return { subjects: subjects, objects: objects, both: subjects.concat(objects) };
	});
	var people_array = [];
	for (var person in people)
		people_array.push(person);

	document.getElementById('title').className = 'done';
	return {
		sentences: sentences,
		people: people,
		people_array: people_array,
		relations: data.relations,
		rel_people: rel_people
	};
}
function format(data) {
	return {
		people: data.people_array,
		sentences: data.sentences.map(function(sentence, i) {
			return {
				duration: 1,
				start: i*2,
				id: i,
				sentence: sentence.sentence,
				chars: [].concat.apply([],sentence.relations.map(function(r) {
					return data.rel_people[r].both;
				})).map(function(person) {
					return data.people_array.indexOf(person);
				})
			};
		}).filter(function(elem) {
			// Remove events with no characters in them
			// Doesn't appear to be 100% effective for some reason
			return elem.chars.length > 0;
		})
	};
}
function table(data) {
	var t = '<table class="sentences"><thead><tr><th>Sentence</th><th>Relation</th>';
	for (person in data.people)
		t += '<th><div class="up"><span>' + person + '</span></div></th>';
	t += '</tr></thead><tbody>';

	var cols = 2 + Object.keys(data.people).length;
	data.sentences.forEach(function(sentence, s) {
		t += '<tr><td colspan="2"><u>' + sentence.sentence + '</u></td></tr>';
		sentence.relations.forEach(function(r) {
			var rel = data.relations[r];
			var rel_person = data.rel_people[r];

			var subject = rel.subject.text;
			if (rel.subject.entities)
				rel.subject.entities.forEach(function(entity) {
					subject = subject.replace(entity.text, '<abbr title="' + entity.text + '">' + entity.text + '</abbr>');
				});

			t += '<tr><td></td><td>' +
				'<span class="subject">' + subject + '</span>' +
				' <span class="action">'  + rel.action.text  + '</span>' +
				(rel.object ? ' <span class="object">' + rel.object.text + '</span>' : '') + '</td>';
			for (person in data.people) {
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
