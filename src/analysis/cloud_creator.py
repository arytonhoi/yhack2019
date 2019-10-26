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

# creates a cloud or rectangle of key words
class WordCloudGenerator:

    def __init__(self):
        pass

    # create a word cloud based on given text file
    # the user can specify the name and format in which they want to store
    # in the export_name field
    # sentiment is 'positive' (blue) or 'negatve' (red)
    # mask_file is optional - use to outline into cloud shape or leave alone for rectangle shape
    def generate_image(self, text_file, export_name, sentiment, mask_file=None):
        text = open(text_file).read()

        # create based on mask file
        if (mask_file is not None):
            mask_image = np.array(Image.open(mask_file))
            wc = WordCloud(background_color="white", mask=mask_image)
        else:
            wc = WordCloud(background_color="white")
        wc.generate(text)

        # color change
        if (sentiment is "positive"):
            wc.recolor(color_func=blue_color_func)
        else:
            wc.recolor(color_func=red_color_func)

        # export
        wc.to_file(export_name)


image = WordCloudGenerator()
image.generate_image("cons.txt", "ex.png", "negative")