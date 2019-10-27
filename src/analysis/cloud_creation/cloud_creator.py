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
useless_words = ["home",  
"nothing", "way", "one", "anything", "airlines", "reason", "something"]

# words to filter - COPY OF ORIGINAL
useless_words1 = ["planes", "plane", "airplane", "flight", "flights", "airline", "home", "jetblue", 
"nothing", "jet blue", "way", "jfk", "boston", "one", "anything", "airlines", "reason", "something"]

# read json data and retrieve keywords, then store in a big list
def getPositiveKeywords(json_file, data_src=None):
    with open(json_file) as f:
        data = json.load(f)
        keyword_list = []
        if data_src is not None:
            for item in data["results"]:
                if item['sentiment_score'] > 0 and item['source'] == data_src:
                    keyword_list.extend(item['keywords'])
            keyword_list = filter(lambda i: i.lower()  not in useless_words, keyword_list)
            return keyword_list
        else:
            for item in data["results"]:
                if item['sentiment_score'] > 0:
                    keyword_list.extend(item['keywords'])
            keyword_list = filter(lambda i: i.lower()  not in useless_words, keyword_list)
            return keyword_list

def getNegativeKeywords(json_file, data_src=None):
    with open(json_file) as f:
        data = json.load(f)
        keyword_list = []
        if data_src is not None:
            for item in data["results"]:
                if item['sentiment_score'] < 0 and item['source'] == data_src:
                    keyword_list.extend(item['keywords'])
            keyword_list = filter(lambda i: i.lower()  not in useless_words, keyword_list)
            return keyword_list
        else:
            for item in data["results"]:
                if item['sentiment_score'] < 0:
                    keyword_list.extend(item['keywords'])
            keyword_list = filter(lambda i: i.lower()  not in useless_words, keyword_list)
            return keyword_list

def getAllKeywords(json_file, data_src=None):
    with open(json_file) as f:
        data = json.load(f)
        keyword_list = []
        if data_src is not None:
            for item in data["results"]:
                if (item['sentiment_score'] < 0 or item['sentiment_score'] > 0) and item['source'] == data_src:
                    keyword_list.extend(item['keywords'])
            keyword_list = filter(lambda i: i.lower()  not in useless_words, keyword_list)
            return keyword_list
        else:
            for item in data["results"]:
                if (item['sentiment_score'] < 0 or item['sentiment_score'] > 0):
                    keyword_list.extend(item['keywords'])
            keyword_list = filter(lambda i: i.lower()  not in useless_words, keyword_list)
            return keyword_list

# create shades of blue for word cloud to represent positive attributes
def blue_color_func(word, font_size, position, orientation, random_state=None, **kwargs):
    return "hsl(235, 100%%, %d%%)" % random.randint(30, 65)

# create shades of red for word cloud to represent negative attributes
def red_color_func(word, font_size, position, orientation, random_state=None, **kwargs):
    return "hsl(0, 100%%, %d%%)" % random.randint(20, 60)

# create shades of red for word cloud to represent negative attributes
def purple_color_func(word, font_size, position, orientation, random_state=None, **kwargs):
    return "hsl(205, 100%%, %d%%)" % random.randint(30, 50)

# creates a cloud or rectangle of key words
class WordCloudGenerator:

    def __init__(self):
        pass

    # create a text file with a given JSON file
    def create_keywords_file(self, json_file, destination, option="", data_src=None):
        if option == "positive":
            list_keywords = getPositiveKeywords(json_file, data_src)
        elif option == "negative":
            list_keywords = getNegativeKeywords(json_file, data_src)
        else:
            list_keywords = getAllKeywords(json_file, data_src)
        cloud_file = open(destination, "w")
        for item in list_keywords:
            cloud_file.write(item)
        cloud_file.close()

    # create a word cloud based on given text file
    # the user can specify the name and format in which they want to store
    # in the export_name field
    # sentiment is 'positive' (blue) or 'negatve' (red) or none (purple)
    # mask_file is optional - use to outline into cloud shape or leave alone for rectangle shape
    def generate_image(self, text_file, export_name, sentiment, mask_file=None):
        text = open(text_file).read()

        for word in useless_words:
            text.replace(word, "")

        # create based on mask file
        if (mask_file is not None):
            mask_image = np.array(Image.open(mask_file))
            wc = WordCloud(background_color="white", mask=mask_image, relative_scaling=0.75)
        else:
            wc = WordCloud(background_color="white", relative_scaling=0.5)
        wc.generate(text)

        # color change
        if sentiment is "positive":
            wc.recolor(color_func=blue_color_func)
        elif sentiment is "negative":
            wc.recolor(color_func=red_color_func)
        else:
            wc.recolor(color_func=purple_color_func)

        # export
        wc.to_file(export_name)

# create a graph of words associated with either positive or negative sentiments towards client
class WordGraphGenerator:

    def __init__(self):
        pass

    # read data from a json file and create a good lookin graph of the top five
    # -1 - -0.25 is negative, 0.25 - 1.0 is positive
    def findTop(self, keywords, num):
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
    def createTopGraph(self, top_list, sentiment, destination):

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

        # set window size 
        plt.figure(figsize=(13, 5))

        # create bar graph
        if sentiment == "positive":
            plt.barh(y_pos, list_count, height=0.2, align='center', color="#00b3ff")
        elif sentiment == "negative":
            plt.barh(y_pos, list_count, height=0.2, align='center', color="#eb3a34")
        else:
            plt.barh(y_pos, list_count, height=0.2, align='center', color="#800080")
        
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
        plt.savefig(destination)

# run
# create instance of WordCloud
image1 = WordCloudGenerator()
image1.create_keywords_file('refined_big_output.json', 'cloud.txt', "", "tripadvisor")
image1.generate_image("cloud.txt", "tripadvisorCloud.png", "", 'cloud.png')
image2 = WordCloudGenerator()
image2.create_keywords_file('refined_big_output.json', 'cloud.txt', "", "twitter")
image2.generate_image("cloud.txt", "twitterCloud.png", "", 'cloud.png')


# create instance of WordGraph
graph1 = WordGraphGenerator()
list_pos = getPositiveKeywords('refined_big_output.json')
list1 = graph1.findTop(list_pos, 7)
graph1.createTopGraph(list1, "positive", "posGraph.png")

graph2 = WordGraphGenerator()
list_neg = getNegativeKeywords('refined_big_output.json')
list2 = graph2.findTop(list_neg, 7)
graph2.createTopGraph(list2, "negative", "negGraph.png")