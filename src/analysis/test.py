# from counter_point.nlp.nlp import NLP
# from counter_point.nlp.topic import Topic
# import tldextract #library for url domain name extraction
# from googleapiclient.discovery import build # google search api
from nlp import NLP
import argparse
import json


class MediaAnalyzer:
  # constructor
  def __init__(self):
    self.nlp = NLP()


  # analyze a list of media posts
  def analyze_media_posts(self, input_json, output_json, salience_threshold=0.005):
    with open(input_json) as f:
      data = json.load(f)

      nlp_results = []
      # create a list of MediaPost objects based on what MediaAnalyzer was able to scrape
      posts = []
      for media_post in data['data']:
        print(media_post)
        nlp_result = self.nlp.analyze(media_post, salience_threshold)
        nlp_result['username'] = media_post['username']
        nlp_results.append(nlp_result)

        # make MediaPost object
        key_words = []
        locations = []
        employees = []

        for entity in nlp_result['entities']:
          key_words.append(entity['value'])
          if entity['type'] == 'LOCATION':
            locations.append(entity['value'])
          elif entity['type'] == 'PERSON':
            employees.append(entity['value'])

        posts.append(MediaPost(key_words,
                              nlp_result['document_sentiment']['score'],
                              locations,
                              employees))

        print(posts[-1].key_words)
        print(posts[-1].sentiment_score)
        print(posts[-1].locations)
        print(posts[-1].employees)
        print('========================================')
        
      results = {'results':nlp_results}

      # write results to json
      with open(output_json, 'w') as fp:
        json.dump(results, fp)

      return posts


class MediaPost:

  def __init__(self,key_words,sentiment_score,locations,employees,source=None,date=None):
    self.key_words = key_words
    self.sentiment_score = sentiment_score
    self.locations = locations
    self.source = source
    self.date = date
    self.employees = employees  


if __name__ == '__main__':
  parser = argparse.ArgumentParser()
  parser.add_argument("json_file")
  parser.add_argument("--out", default='test_output.json')
  args = parser.parse_args()

  input_json = args.json_file
  output_json = args.out

  MediaAnalyzer = MediaAnalyzer()  
  MediaAnalyzer.analyze_media_posts(input_json, output_json)


