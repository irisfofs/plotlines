import json

plotline = json.load(open("plotlines2.json"))
chars = json.load(open("characters.json"))

new_format = {}

scenes = []
oldscene = {"start":0, "duration": 0, "id": -1}
count = 0

def indexOfChar(name):
	for i in range(len(chars)):
		if chars[i]['name'] == name:
			return i
	return -1

for event in plotline:
	scene = {"duration": 1,
			 "start": oldscene['start'] + oldscene['duration'],
			 "id": count}
	count += 1

	if count > 500:
		break

	scene['chars'] = []
	for act in event['actors']:
		index = indexOfChar(act)
		if index < 0:
			print "Something went terribly wrong" + act
			break
		scene['chars'].append(index)

	if len(scene['chars']) > 0:
		scenes.append(scene)

		oldscene = scene
	else:
		count -= 1

new_format['scenes'] = scenes

new_format['panels'] = count

with open("reparsed.json", "w") as outfile:
	json.dump(new_format, outfile, indent=4, separators=(',', ': '))
