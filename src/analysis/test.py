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
  threshold = 0.01

  json_file = args.json_file
  with open(json_file) as f:
    data = json.load(f)
    for obj in data['data']:
      
      dict_json = {'document_sentiment': nlp.get_whole_sentiment(obj['content']),
                    'entities': nlp.get_entities(obj['content'], threshold)}
      with open('test_output.json', 'w') as fp:
        json.dump(dict_json, fp)
