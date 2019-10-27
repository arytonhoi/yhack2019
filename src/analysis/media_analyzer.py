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

      raw_nlp_results = []
      refined_nlp_results = []
      for media_post in data['data']:
        key_words = []
        locations = []
        employees = []
        source = media_post['source']

        # api call
        raw_nlp_result = self.nlp.analyze(media_post, salience_threshold)
        raw_nlp_result['source'] = source

        # if source is tripadvisor get location, username, and date
        if source == 'tripadvisor':
          locations = media_post['categories'][0].split('-')
          i = media_post['username'].split().index('wrote')
          raw_nlp_result['username'] = "".join(media_post['username'].split()[0:i])
          first_line = media_post['username'].split('\n')[0]
          j = first_line.split().index('review')
          raw_nlp_result['date'] = "".join(first_line.split()[j + 1:])
        elif source == 'twitter':
          raw_nlp_result['username'] = media_post['content'].split()[0]
          raw_nlp_result['date'] = ""

        # get data for refined result
        for entity in raw_nlp_result['entities']:
          # throw away handles
          if (not '@' in entity['value']) and (not 'JetBlue' in entity['value']):
            key_words.append(entity['value'])
            if entity['type'] == 'LOCATION':
              locations.append(entity['value'])
            if entity['type'] == 'NAME':
              employees.append(entity['value'])

        # get refined result
        refined_result = {}
        refined_result['username'] = raw_nlp_result['username']
        refined_result['source'] = source
        refined_result['date'] = raw_nlp_result['date']
        refined_result['sentiment_score'] = raw_nlp_result['document_sentiment']['score']
        refined_result['sentiment_magnitude'] = raw_nlp_result['document_sentiment']['magnitude']
        refined_result['keywords'] = key_words
        refined_result['location'] = locations
        refined_result['employees'] = employees
        refined_result['content'] = media_post['content']

        if not 'JetBlue' in refined_result['username']:
          raw_nlp_results.append(raw_nlp_result)
          refined_nlp_results.append(refined_result)
          print(refined_result)
          print("==========")

      raw_results = {'results':raw_nlp_results}
      refined_results = {'results':refined_nlp_results}

      # write raw results to json
      with open('raw_' + output_json, 'w') as fp:
        json.dump(raw_results, fp)

      # write refined results to json
      with open('refined_' + output_json, 'w') as fp:
        json.dump(refined_results, fp)


if __name__ == '__main__':
  parser = argparse.ArgumentParser()
  parser.add_argument("json_file")
  parser.add_argument("--out", default='test_output.json')
  args = parser.parse_args()

  input_json = args.json_file
  output_json = args.out

  MediaAnalyzer = MediaAnalyzer()  
  posts = MediaAnalyzer.analyze_media_posts(input_json, output_json)