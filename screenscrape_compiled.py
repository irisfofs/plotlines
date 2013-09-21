from bs4 import BeautifulSoup
from bs4 import NavigableString
import wget
import re
import json
import sys
import traceback

urlbase = "http://www.mspaintadventures.com/?s=6&p=00"
searchbase = "http://www.mspaintadventures.com/?search=6_"
localbase = "search_"
first = 1901 # first comic
# first = 2010 # first with pesterlog

characters = json.load(open("characters.json", "r"))
css_colors = json.load(open("css_colors.json", "r"))

def findCharacterByColor(color):
	if color in css_colors:
		color = css_colors[color]
	for c in characters:
		if color == c['color']:
			return c
	return None

def findCharacterByPrefix(prefix):
	for c in characters:
		if prefix.upper() == c['name'].split(' ')[0].upper():
			return c
	return None

def characterMatches(prefix, character):
	# check first name
	if prefix.upper() == re.match('(\w+)', character['name']).group(1).upper():
		return True
	# check handles
	for handle in character['handles']:
		if prefix.upper() == handle[0]:
			return True
	return False

def getPrefix(string):
	m = re.match('(\w*):', string)
	if m is not None:
		return m.group(1)
	return None

# try:
# 	bigdict = json.load(open("plotlines2.json","r"))
# 	first = bigdict[len(bigdict)-1][comic]
# except:
bigdict = []
# first = 1901 # first comic

try: 
	for x in range(3):
		# filename = wget.download(searchbase + str(x + 1))
		filename = localbase + str(x+1) + ".html"
		print "Loading " + filename
		soup = BeautifulSoup(open(filename), "html5lib", from_encoding="latin-1")
		print "Scraping..."

		wrapper = soup.find("table", attrs={"width": "80%"})

		nextTitle = wrapper.find_all("center")[1].find("b")

		while nextTitle is not None:
			title = nextTitle.a.get_text().strip()[1:-1]
			lines = []
			chars = {}

			cnum = int(nextTitle.a['href'][-6:])

			titlePrefix = getPrefix(title)
			if titlePrefix != None:
				titleChar = findCharacterByPrefix(titlePrefix)
				if titleChar != None:
					chars[titleChar['name']] = True

			nextTitle = nextTitle.next_sibling

			# iterate until next bold
			while (nextTitle is not None) and (nextTitle.name != 'b'):
				# print("Name: " + str(nextTitle.name))
				
				# if it is text span, inspect
				if nextTitle.name == 'span':
					# match prefix
					prefix = getPrefix(nextTitle.get_text())
					if prefix is not None:
						color = re.search('color: ?(#[0-9a-fA-F]{6}|red)', nextTitle['style'])
						if color is not None:
							color = color.group(1) # just the hex code
							char = findCharacterByColor(color)
							if char is not None and characterMatches(prefix, char):
								chars[char['name']] = True

				nextTitle = nextTitle.next_sibling

			#todo: infer actor from title

			info = {'comic': cnum,
				'title': title,
				'actors': chars.keys() }
			bigdict.append(info)

			# nextTitle = nextTitle.find_next_sibling("b")

except:
	exc_info = sys.exc_info()
	print "Exception: ", exc_info
	print traceback.print_tb(exc_info[2])
	print cnum

with open("plotlines2.json", "w") as outfile:
	json.dump(bigdict, outfile)