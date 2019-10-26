# from counter_point.nlp.nlp import NLP
# from counter_point.nlp.topic import Topic
# import tldextract #library for url domain name extraction
# from googleapiclient.discovery import build # google search api
from nlp import NLP
import argparse
import json


class Media_Analyzer:
  # constructor
  def __init__(self):
    self.nlp = NLP()


  # analyze a list of media posts
  def analyze_media_posts(self, input_json, output_json, salience_threshold=0.001):
    with open(input_json) as f:
      data = json.load(f)

      nlp_results = []
      for media_post in data['data']:
        nlp_result = self.nlp.analyze(media_post, salience_threshold)
        nlp_result['username'] = media_post['username']
        nlp_results.append(nlp_result)

      results = {'results':nlp_results}
      with open(output_json, 'w') as fp:
        json.dump(results, fp)


if __name__ == '__main__':
  parser = argparse.ArgumentParser()
  parser.add_argument("json_file")
  parser.add_argument("--out", default='test_output.json')
  args = parser.parse_args()

  input_json = args.json_file
  output_json = args.out

  media_analyzer = Media_Analyzer()  
  media_analyzer.analyze_media_posts(input_json, output_json)