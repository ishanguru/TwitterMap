# Here is where we can store and seach for tweets from the document

from ElasticSearchServices import ElasticSearchServices

class TwitterHandler:
	
	def __init__(self):
		self.es = ElasticSearchServices()
		self.index = "twittermapindex"
		self.doc_type = "alltweets"

	def getTweets(self, keyword):
		body = {
			"query": {
				"match": {
					"_all": keyword
				}
			}
		}
		
		size = 10000
		result = self.es.search(self.index, self.doc_type, body, size)

		return result

	def insertTweet(self, id, longitude, latitude, tweet, author, timestamp):
		body = {
			"id": id,
			"longitude": longitude,
			"latitude": latitude,
			"message": tweet,
			"author": author,
			"timestamp": timestamp
		}

		result = self.es.store_data(self.index, self.doc_type, body)

		return result


#Purely for testing purposes

'''
if __name__ == '__main__':
	tweetHandler = TwitterHandler()

	# final_longitude = 1234
	# final_latitude = 1234
    #
	# tweetId = 1234
	# tweet = "Ishan is cool"
	# author = "Ishan2"
	# timestamp = None

	# print(tweetHandler.insertTweet(tweetId, final_longitude, final_latitude, tweet, author, timestamp))
	print(tweetHandler.getTweets("coffee"))

	# print("Inserted")
'''