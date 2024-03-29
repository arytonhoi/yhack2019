# Imports the Google Cloud client library
from google.cloud import language_v1
from google.cloud.language_v1 import enums
from google.cloud import language
from google.cloud.language import enums
from google.cloud.language import types

class NLP:
  # Constructor
  # Instantiates a client
  def __init__(self):
    self.client = language.LanguageServiceClient()


  # calls api to get the sentiment of the entire document
  # returns dictionary of form:
  # {
  #   'score':double,
  #   'magnitude':double
  # }
  def get_whole_sentiment(self,content,language='en',
              type_ = enums.Document.Type.PLAIN_TEXT, encoding_type=enums.EncodingType.UTF8):
    # call API to get entity analysis
    document = {"content": content, "type": type_, "language": language}
    api_response = self.client.analyze_sentiment(document, encoding_type=encoding_type)
    return {'score':api_response.document_sentiment.score,
            'magnitude':api_response.document_sentiment.magnitude}


  # calls api to get individual entity information
  # returns list of dictionaries, each of form:
  # {
  #   'value': string, 
  #   'type': string, 
  #   'salience': double, 
  #   'sentiment': {
  #     'score': double, 
  #    'magnitude': double
  #   }
  # }
  def get_entities(self,content,salience_threshold,language='en',
              type_=enums.Document.Type.PLAIN_TEXT, encoding_type=enums.EncodingType.UTF8):
    entities = []

    # call API to get entity analysis
    document = {"content": content, "type": type_, "language": language}
    api_response = self.client.analyze_entity_sentiment(document, encoding_type=encoding_type)

    for entity in api_response.entities:
      is_proper = False
      for mention in entity.mentions:
        if (enums.EntityMention.Type(mention.type).name == 'PROPER'):
          # print(mention.text.content)
          is_proper = True
      
      entity_salience = entity.salience
      if entity_salience > salience_threshold:
        if is_proper and (enums.Entity.Type(entity.type).name == 'PERSON'):
          entity_type = 'NAME'
        else:
          entity_type = enums.Entity.Type(entity.type).name
        entities.append({'value': entity.name, 
                        'type': entity_type, 
                        'salience': entity.salience, 
                        'sentiment': {'score': entity.sentiment.score, 
                                      'magnitude': entity.sentiment.magnitude}
                        })
    return entities 


  # calls api (via helper methods) to get both document level sentiment and
  # individual entity level information
  # returns dictionary of form:
  # {
  #   'document_sentiment': {
  #     'score':double, 
  #     'magnitude':double
  #   },
  #   ['entities': {
  #     'value': string, 
  #     'type': string, 
  #     'salience': double, 
  #     'sentiment': {
  #       'score': double, 
  #       'magnitude': double}
  #     }]
  #   }
  # }
  def analyze(self,content_object,salience_threshold,language='en',
            type_=enums.Document.Type.PLAIN_TEXT, encoding_type=enums.EncodingType.UTF8):
    return {'document_sentiment': self.get_whole_sentiment(content_object['content']),
            'entities': self.get_entities(content_object['content'], salience_threshold)}