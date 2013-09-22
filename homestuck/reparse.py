import json

SHOW_ALONE_TIME = False
TOTAL_COMICS_SHOWN = 8000
IN_FILE = "plotlines.json"
CHAR_FILE = "characters.json"
OUT_FILE = "reparsed.json"


plotline = json.load(open(IN_FILE))
chars = json.load(open(CHAR_FILE))
new_format = {}
scenes = []
oldscene = {"start":0, "duration": 0, "id": -1}
count = 0
event_count = 0

def indexOfChar(name):
	for i in range(len(chars)):
		if chars[i]['name'] == name:
			return i
	return -1

if SHOW_ALONE_TIME:
	char_min = 0
else:
	char_min = 1

for event in plotline:
	scene = {"duration": 1,
			 "start": oldscene['start'] + oldscene['duration'],
			 "id": count}
	count += 1
	event_count += 1

	if event_count > TOTAL_COMICS_SHOWN:
		break

	scene['chars'] = []
	for act in event['actors']:
		index = indexOfChar(act)
		if index < 0:
			print "Something went terribly wrong" + act
			break
		scene['chars'].append(index)

	if len(scene['chars']) > char_min:
		scenes.append(scene)

		oldscene = scene
	else:
		count -= 1


new_format['scenes'] = scenes

new_format['panels'] = count

with open(OUT_FILE, "w") as outfile:
	json.dump(new_format, outfile, indent=4, separators=(',', ': '))
