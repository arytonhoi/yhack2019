import os

from os import path
import numpy as np
from PIL import Image
from wordcloud import WordCloud
import random

import json
import operator

import matplotlib.pyplot as plt
import math
import numpy as np

# words to filter
useless_words = ["planes", "plane", "airplane", "flight", "flights", "airline", "home", "jetblue", 
"nothing", "jet blue", "way", "jfk", "boston", "one", "anything", "airlines", "reason", "something"]

# read json data and retrieve keywords, then store in a big list
def getPositiveKeywords(json_file):
    with open(json_file) as f:
        data = json.load(f)
        keyword_list = []
        for item in data["results"]:
            if item['sentiment_score'] >= 0.25:
                keyword_list.extend(item['keywords'])
        keyword_list = filter(lambda i: i.lower()  not in useless_words, keyword_list)
        return keyword_list

def getNegativeKeywords(json_file):
    with open(json_file) as f:
        data = json.load(f)
        keyword_list = []
        for item in data["results"]:
            if item['sentiment_score'] <= -0.25:
                keyword_list.extend(item['keywords'])
        keyword_list = filter(lambda i: i.lower()  not in useless_words, keyword_list)
        return keyword_list

# create shades of blue for word cloud to represent positive attributes
def blue_color_func(word, font_size, position, orientation, random_state=None, **kwargs):
    return "hsl(235, 100%%, %d%%)" % random.randint(30, 65)

# create shades of red for word cloud to represent negative attributes
def red_color_func(word, font_size, position, orientation, random_state=None, **kwargs):
    return "hsl(0, 100%%, %d%%)" % random.randint(20, 60)

# creates a cloud or rectangle of key words
class WordCloudGenerator:

    def __init__(self):
        pass

    def create_keywords_file(self, json_file, destination, option):
        if option == "positive":
            list_keywords = getPositiveKeywords(json_file)
        else:
            list_keywords = getNegativeKeywords(json_file)
        cloud_file = open(destination, "w")
        for item in list_keywords:
            cloud_file.write(item)
        cloud_file.close()

    # create a word cloud based on given text file
    # the user can specify the name and format in which they want to store
    # in the export_name field
    # sentiment is 'positive' (blue) or 'negatve' (red)
    # mask_file is optional - use to outline into cloud shape or leave alone for rectangle shape
    def generate_image(self, text_file, export_name, sentiment, mask_file=None):
        text = open(text_file).read()

        for word in useless_words:
            text.replace(word, "")

        # create based on mask file
        if (mask_file is not None):
            mask_image = np.array(Image.open(mask_file))
            wc = WordCloud(background_color="white", mask=mask_image, relative_scaling=0.5)
        else:
            wc = WordCloud(background_color="white", relative_scaling=1)
        wc.generate(text)

        # color change
        if (sentiment is "positive"):
            wc.recolor(color_func=blue_color_func)
        else:
            wc.recolor(color_func=red_color_func)

        # export
        wc.to_file(export_name)

# create instance of WordCloud
image = WordCloudGenerator()
image.create_keywords_file('refined_big_output.json', 'cloud.txt', "negative")
image.generate_image("cloud.txt", "ex.png", "negative", 'cloud.png')

# read data from a json file and create a good lookin graph of the top five
# -1 - -0.25 is negative, 0.25 - 1.0 is positive
def findTop(keywords, num):
    coll = {}
    for item in keywords:
        if item in coll:
            coll[item] += 1
        else:
            coll[item] = 1
    
    # converts dict to list of tuples of key-value pairs
    coll_sorted = sorted(coll.items(), key=lambda kv: kv[1], reverse=True)

    if len(coll_sorted) <= num:
        return coll_sorted
    
    else:
        top_list = []
        for i in range(num):
            top_list.append(coll_sorted[i])
        return top_list

# graph result of top results
def createTopGraph(top_list, sentiment):

    # x values
    list_words = []
    # y values
    list_count = []
    # populate
    for item in top_list:
        # key, aka word
        list_words.append(item[0].title() + "  ")
        # value, aka count
        list_count.append(item[1])

    # reverse to go form most at top to least on bottom
    list_words.reverse()
    list_count.reverse()

    # set width of bars
    y_pos = np.arange(len(list_words))

    # font = {'fontname':'Lucida Grande'}
    # set window size 
    plt.figure(figsize=(13, 5))

    # add **font if you want to change font
    # plt.title("All-Time Top 5 Words", fontsize = 20, fontweight='bold', color="#001e5e", loc='left')
    # plt.text(0.01, 0.9, s="All-Time Top 5 Words", fontsize = 20, fontweight='bold', color="#001e5e", transform=plt.gcf().transFigure)
    # create bar graph
    if sentiment == "positive":
        plt.barh(y_pos, list_count, height=0.2, align='center', color="#00b3ff")
    else:
        plt.barh(y_pos, list_count, height=0.2, align='center', color="#eb3a34")
    # set labels on left for words
    plt.yticks(y_pos, list_words, fontweight='bold', color="#001e5e")
    # leave labels on x axis blank for clarity
    plt.xticks([])

    # shorten tick lengths to 0
    plt.tick_params(axis=u'both', which=u'both', length=0)

    # remove border
    for spine in plt.gca().spines.values():
        spine.set_visible(False)

    # set data next to bar to represent number of comments
    for i, v in enumerate(list_count):
        plt.text(v + 0.5, i - 0.05, str(v) + " comments", color="#001e5e", fontweight='bold')
    
    # save
    plt.savefig('graph.png')

# run
list_pos = getPositiveKeywords('refined_big_output.json')
list_7 = findTop(list_pos, 7)
createTopGraph(list_7, "positive")