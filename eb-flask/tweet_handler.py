# Here is where we can store and seach for tweets from the document

from elastic.services import *

class TwitterHandler:
	
	def __init__(self, arg):
		super(TwitterHandler, self).__init__()
		self.es = ElasticsearchServices()
		self.index = "twitterMapIndex"
		self.doc_type = "allTweets"
		self.size = 20
		
	def insertTweet(self, id, longitude, latitude, tweet, author, timestamp):
		body = {
			"id": id,
			"longitude": longitude,
			"latitude": latitude,
			"message": tweet,
			"author": author,
			"timestamp": timestamp
		}

		result = self.es.store_data(self.index, self.doc_type, self.body, self.size)

		return result