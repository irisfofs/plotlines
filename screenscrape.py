from bs4 import BeautifulSoup
import wget
import re
import json

urlbase = "http://www.mspaintadventures.com/?s=6&p=00"
searchbase = "http://www.mspaintadventures.com/?search=6_"
first = 1901 # first comic
# first = 2010 # first with pesterlog

characters = json.load(open("characters.json", "r"))

def findCharacterByColor(color):
	for c in characters:
		if color == c['color']:
			return c
	return None

def characterMatches(prefix, character):
	# check first name
	if prefix.upper() == re.match('(\w+)', character.name).group(1).upper():
		return True
	# check handles
	for handle in character.handles:
		if prefix.upper() == handle[0]:
			return True
	return False

try:
	bigdict = json.load(open("plotlines2.json","r"))
	first = bigdict[len(bigdict)-1][comic]
except:
	bigdict = []
	first = 1901 # first comic

try: 
	for x in range(3):
		filename = wget.download(searchbase + str(x + 1))
		soup = BeautifulSoup(open(filename), "html5lib", from_encoding="latin-1")

		wrapper = soup.find("table", attrs={"width": "80%"})

		nextTitle = wrapper.find_all("center")[1].find("b")

		while nextTitle is not None:
			title = nextTitle.get_text()
			lines = []
			chars = []
			# iterate until next bold
			while nextTitle is not None and nextTitle.name is not 'b':
				nextTitle = nextTitle.next
				# if it is text span, inspect
				if nextTitle.name == 'span':
					# match prefix
					result = re.search('^(\w*):', line.get_text())
					if result is not None:
						prefix = result.group(1)
						color = re.search('color: ?(#[0-9a-fA-F]{6})', nextTitle['style'])
						if color is not None:
							color = color[1] # just the hex code
						char = findCharacterByColor(color)
						if characterMatches(prefix, char):
							chars.append(character.name)


			info = {'comic': cnum,
				'title': title,
				'actors': chars.keys() }
			bigdict.append(info)

			# nextTitle = nextTitle.find_next_sibling("b")

# try:
# 	for x in range(3000 - first):
# 		cnum = first + x;

# 		filename = wget.download(urlbase + str(cnum))
# 		soup = BeautifulSoup(open(filename), "lxml")
		
# 		handles = {}
# 		pesterlog = soup.select("div.spoiler")
# 		if len(pesterlog) > 0:
# 			lines = pesterlog[0].find_all('span')
# 			for line in lines:
# 				result = re.search('^(\w*):', line.get_text())
# 				if result is not None:
# 					handles[result.group(1)] = True


# 		# comic wrapper table
# 		wrapper = soup.find("table", attrs={"width": "600"})
		
# 		title = wrapper.find("table", attrs={"width": "600"}).find("p").get_text().strip()

# 		# command = wrapper.find()
# 		info = {'comic': cnum,
# 				'title': title,
# 				'actors': handles.keys() }
# 		bigdict.append(info)

except :
	print "Exception: ",sys.exc_info()[0]

with open("plotlines2.json", "w") as outfile:
	json.dump(bigdict, outfile)