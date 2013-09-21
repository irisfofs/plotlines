from bs4 import BeautifulSoup
import wget
import re
import json

urlbase = "http://www.mspaintadventures.com/?s=6&p=00"
first = 1901 # first comic
# first = 2010 # first with pesterlog

try:
	bigdict = json.load(open("plotlines.json","r"))
	first = bigdict[len(bigdict)-1][comic]
except:
	bigdict = []
	first = 1901 # first comic

try:
	for x in range(3000 - first):
		cnum = first + x;

		filename = wget.download(urlbase + str(cnum))
		soup = BeautifulSoup(open(filename), "lxml")
		
		handles = {}
		pesterlog = soup.select("div.spoiler")
		if len(pesterlog) > 0:
			lines = pesterlog[0].find_all('span')
			for line in lines:
				result = re.search('^(\w*):', line.get_text())
				if result is not None:
					handles[result.group(1)] = True


		# comic wrapper table
		wrapper = soup.find("table", attrs={"width": "600"})
		
		title = wrapper.find("table", attrs={"width": "600"}).find("p").get_text().strip()

		# command = wrapper.find()
		info = {'comic': cnum,
				'title': title,
				'actors': handles.keys() }
		bigdict.append(info)

except :
	print "Exception: ",sys.exc_info()[0]

with open("plotlines.json", "w") as outfile:
	json.dump(bigdict, outfile)