from nlp import NLP
import random
import argparse
import json
import csv


class MediaAnalyzer:
  # constructor
  def __init__(self):
    self.nlp = NLP()


  def find_month(self, month):
    prefix = month[0:3].lower()
    if prefix == 'jan':
      month_num = 1
    elif prefix == 'feb':
      month_num = 2
    elif prefix == 'mar':
      month_num = 3
    elif prefix == 'apr':
      month_num = 4
    elif prefix == 'may':
      month_num = 5
    elif prefix == 'jun':
      month_num = 6
    elif prefix == 'jul':
      month_num = 7
    elif prefix == 'aug':
      month_num = 8
    elif prefix == 'sep':
      month_num = 9
    elif prefix == 'oct':
      month_num = 10
    elif prefix == 'nov':
      month_num = 11
    elif prefix == 'dec':
      month_num = 12
    else:
      month_num = 0
    return month_num

  # convert date
  def convert_date(self, date):
    if date.lower() == 'yesterday' or date.lower() == 'today':
      date_string = date.lower()
    elif (len(date.split()) > 1):
      # MMM* D*
      month_num = self.find_month(date.split()[0])
      print(date)
      date_string = "{:02d}/{:02d}".format(month_num, int(date.split()[1]))
    else:
      # MMMYYYY
      month_num = self.find_month(date[0:3])
      # make random day
      date_string = "{:02d}/{:02d}".format(month_num, random.randint(1,28))
    
    print(date_string)
    return date_string


  # analyze a list of media posts
  def analyze_media_posts(self, input_json, output_json, salience_threshold=0.005):
    with open(input_json) as f:
      data = json.load(f)

      raw_nlp_results = []
      refined_nlp_results = []
      count = 1
      for media_post in data['data']:
        print(count)
        count += 1
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
        else:
          raw_nlp_result['username'] = media_post['username']
          raw_nlp_result['date'] = media_post['date']

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
        refined_result['content'] = media_post['content'].replace('\n','')

        if not 'JetBlue' in refined_result['username']:
          raw_nlp_results.append(raw_nlp_result)
          refined_nlp_results.append(refined_result)
          # print(refined_result)
          # print("==========")

      raw_results = {'results':raw_nlp_results}
      refined_results = {'results':refined_nlp_results}

      # write raw results to json
      # with open('raw_' + output_json, 'w') as fp:
      #   json.dump(raw_results, fp)

      # write refined results to json
      with open('refined_' + output_json, 'w') as fp:
        json.dump(refined_results, fp)


  # convert json file into csv dataset
  def make_csv(self, json_filename, csv_filename):
    with open(json_filename, mode='r') as json_file:
      with open(csv_filename, mode='w') as csv_file:
        fieldnames = ['employee', 'location', 'source', 'date', 'sentiment', 'comment']
        writer = csv.DictWriter(csv_file, fieldnames=fieldnames)
      
        data = json.load(json_file)
        writer.writeheader()
        for media_post in data['results']:
          if len(media_post['employees']) > 0:
            row_dict = {}
            row_dict['employee'] = ", ".join(media_post['employees'])
            row_dict['location'] = " // ".join(media_post['location'][:2])
            row_dict['source'] = media_post['source']
            row_dict['date'] = self.convert_date(media_post['date'])
            row_dict['sentiment'] = 'positive' if (media_post['sentiment_score'] > 0) else 'negative'
            row_dict['comment'] = media_post['content'].replace('\n','')
            print(row_dict)
            writer.writerow(row_dict)


  # get info
  def get_media_summary_info(self,json_filename,sources):
    num_total_posts = 0
    num_employee_posts = 0
    sources_count_dict = {}
    for source in sources:
      sources_count_dict[source] = 0

    with open(json_filename, mode='r') as json_file:
      data = json.load(json_file)

      for media_post in data['results']:
        num_total_posts += 1
        sources_count_dict[media_post['source']] += 1

        if (len(media_post['employees']) > 0):
          num_employee_posts += 1

    percent_employee_posts = float(num_employee_posts) / float(num_total_posts)
    sources_percent_dict = {}
    for source in sources:
      sources_percent_dict[source] = float(sources_count_dict[source]) / float(num_total_posts)
    
    # print(percent_employee_posts)
    # print(num_employee_posts)
    # print(sources_percent_dict)
    return percent_employee_posts, num_employee_posts, sources_percent_dict
          

if __name__ == '__main__':
  parser = argparse.ArgumentParser()
  parser.add_argument("json_file")
  # parser.add_argument("out")
  args = parser.parse_args()

  input_json = args.json_file
  # output_file = args.out

  MediaAnalyzer = MediaAnalyzer()  
  # posts = MediaAnalyzer.analyze_media_posts(input_json, output_file)
  # MediaAnalyzer.make_csv(input_json,output_file)
  percent_employee_posts, num_employee_posts, sources_percent_dict = MediaAnalyzer.get_media_summary_info(input_json,['facebook','twitter','tripadvisor'])

  print("percent employee posts: {}, num employee posts: {}".format(percent_employee_posts,num_employee_posts))
  for key,value in sources_percent_dict.items():
    print("{}, {}".format(key, value))