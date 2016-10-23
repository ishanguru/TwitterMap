import tweepy
import json
from tweepy import Stream
from tweepy.streaming import StreamListener
from TweetHandler import TwitterHandler

consumerKey="CPZFTDBHjLW7ZNXcvPLkB063f"
consumerSecret="2aiO9j6alC0wKWYOLTmNbo8wCGpRGu0O4QHWAork70gYCZMEk4"
accessToken="786036603332329472-GVyUTbel8v80MlM3iii5QhZuGL1biO0"
accessSecret="5d2Knn1NyR5Vfzsk1VSKziPubURmn7AXzOs6LOeZO96Dl"
KEYWORDS = ['chelsea', 'premier', 'pokemon', 'fruit', 'food', 'coffee', 'pizza', 'california']

class TweetListener(StreamListener):

    def on_data(self, data):
        try:
            self.parse_data(data)
        except:
            print("Error")

        return(True)

    def on_error(self, status):
        errorMessage = "Error - Status code " + str(status)
        print(errorMessage)

    def parse_data(data):
        json_data_file = json.loads(data)
        tweetHandler = TwitterHandler()

        location = json_data_file["place"]
        coordinates = json_data_file["coordinates"]

        if coordinates is not None:
            print(json_data_file["coordinates"])
            final_longitude = json_data_file["coordinates"][0]
            final_latitude = json_data_file["coordinates"][0]
        elif location is not None:
            coord_array = json_data_file["place"]["bounding_box"]["coordinates"][0]
            longitude = 0;
            latitude = 0;
            for object in coord_array:
                print(object)
                longitude = longitude + object[0]
                latitude = latitude + object[1]
            print(longitude / len(coord_array))
            print(latitude / len(coord_array))

            final_longitude = longitude / len(coord_array)
            final_latitude = latitude / len(coord_array)

        tweetId = json_data_file['id_str']
        tweet = json_data_file["text"]
        author = json_data_file["user"]["name"]
        timestamp = json_data_file["created_at"]

        tweetHandler.insertTweet(tweetId, final_longitude, final_latitude, tweet, author, timestamp)

def startStream():

    auth = tweepy.OAuthHandler(consumerKey, consumerSecret)
    auth.set_access_token(accessToken, accessSecret)
    twitterStream = Stream(auth, TweetListener())
    # twitterStream.filter(locations=[-180,-90, 180, 90])
    twitterStream.filter(track=KEYWORDS)

    #The location specified above gets all tweets, we can then filter and store based on what we want

# For testing purposes only
if __name__ == '__main__':
    startStream()

