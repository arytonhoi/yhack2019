import os

from os import path
import numpy as np
from PIL import Image
from wordcloud import WordCloud

class WordCloudGenerator:

    def __init__(self):
        pass

    def generate_image(self, text_file, mask_file, export_name):
        text = open(text_file).read()
        mask_image = np.array(Image.open(mask_file))

        WordCloud(background_color="white", mask=mask_image).generate(text).to_file(export_name)


image = WordCloudGenerator()
image.generate_image("cons.txt", "export.png", "ex.png")