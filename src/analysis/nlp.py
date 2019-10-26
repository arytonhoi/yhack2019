# Imports the Google Cloud client library
from google.cloud import language
from google.cloud.language import enums
from google.cloud.language import types

class NLP:
    # Constructor
    # Instantiates a client
    def __init__(self):
        self.client = language.LanguageServiceClient()

    # 
    def get_whole_sentiment(self,content,language='en',
                type_ = enums.Document.Type.PLAIN_TEXT, encoding_type=enums.EncodingType.UTF8):
 
        # call API to get entity analysis
        document = {"content": content, "type": type_, "language": language}
        api_response = self.client.analyze_sentiment(document, encoding_type=encoding_type)
        return api_response.document_sentiment


    def get_entities(self,content,salience_threshold,language='en',
                type_=enums.Document.Type.PLAIN_TEXT, encoding_type=enums.EncodingType.UTF8):
        # print('getting topics')
        # topics list
        entities = []

        # call API to get entity analysis
        document = {"content": content, "type": type_, "language": language}
        api_response = self.client.analyze_entity_sentiment(document, encoding_type=encoding_type)

        # loop over entities in api response

        # # Detects the sentiment of the text
        # sentiment = client.analyze_sentiment(document=document).document_sentiment

        # print('Text: {}'.format(text))
        # print('Sentiment: {}, {}'.format(sentiment.score, sentiment.magnitude))

        

        for entity in api_response.entities:


            entity_salience = entity.salience
            if entity_salience > salience_threshold:

                entities.append({'value': entity.name, 
                                'type': enums.Entity.Type(entity.type).name, 
                                'salience': entity.salience, 
                                'sentiment': {'score': entity.sentiment.score, 
                                            'magnitude': entity.sentiment.magnitude}})

        return entities