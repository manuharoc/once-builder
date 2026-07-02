import sys
from bs4 import BeautifulSoup

soup = BeautifulSoup(open('laliga.html', encoding='utf-8'), 'html.parser')
for div in soup.find_all('div', class_='text-left text-nowrap mr-2 nom_equip float-left'):
    a = div.find('a')
    if a:
        print(f"{a.text}: {a['href']}")
