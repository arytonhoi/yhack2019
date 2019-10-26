import os

from os import path
import numpy as np
from PIL import Image
from wordcloud import WordCloud
import random

# create shades of blue for word cloud to represent positive attributes
def blue_color_func(word, font_size, position, orientation, random_state=None, **kwargs):
    return "hsl(235, 100%%, %d%%)" % random.randint(30, 65)

# create shades of red for word cloud to represent negative attributes
def red_color_func(word, font_size, position, orientation, random_state=None, **kwargs):
    return "hsl(0, 100%%, %d%%)" % random.randint(40, 80)

class WordCloudGenerator:

    def __init__(self):
        pass


    def generate_image(self, text_file, export_name, sentiment, mask_file=None):
        text = open(text_file).read()
        if (mask_file is not None):
            mask_image = np.array(Image.open(mask_file))
            wc = WordCloud(background_color="white", mask=mask_image)
        else:
            wc = WordCloud(background_color="white")
        wc.generate(text)
        if (sentiment is "positive"):
            wc.recolor(color_func=blue_color_func)
        else:
            wc.recolor(color_func=red_color_func)
        wc.to_file(export_name)
        return wc


image = WordCloudGenerator()
image.generate_image("cons.txt", "ex.png", "negative")