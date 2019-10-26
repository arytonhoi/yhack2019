# from counter_point.nlp.nlp import NLP
# from counter_point.nlp.topic import Topic
# import tldextract #library for url domain name extraction
# from googleapiclient.discovery import build # google search api
from nlp import NLP
import argparse
import json

if __name__ == '__main__':
  parser = argparse.ArgumentParser()
  parser.add_argument("json_file")
  args = parser.parse_args()

  nlp = NLP()

  json_file = args.json_file
  with open(json_file) as f:
    data = json.load(f)
    for obj in data['data']:
      print(nlp.get_whole_sentiment(obj['content']))