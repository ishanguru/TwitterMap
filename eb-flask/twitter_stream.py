import tweepy
import json
from tweepy import Stream
from tweepy.streaming import StreamListener

consumerKey="MdcdXYuq2MUYkI84xmkWW6OLJ"
consumerSecret="kpRq1uRnoYPez2mR84h3JIkrSC4YyFe9EjCHmi3MFmUY9Mn4Gv"
accessToken="786036603332329472-GVyUTbel8v80MlM3iii5QhZuGL1biO0"
accessSecret="5d2Knn1NyR5Vfzsk1VSKziPubURmn7AXzOs6LOeZO96Dl"

class listener(StreamListener):

    def on_data(self, data):
        try:
            parse_data(data)
        except:
            print("Error")
        return(True)

    def on_error(self, status):
        print(status)

def parse_data(data):
    json_data_file = json.loads(data)
    tweetHandler = TwitterHandler()

    # Pass in arg into TwitterHandler as an array, of all the things the user inputs to search

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

if __name__ == '__main__':

    auth = tweepy.OAuthHandler(consumerKey, consumerSecret)
    auth.set_access_token(accessToken, accessSecret)
    twitterStream = Stream(auth, listener())
    twitterStream.filter(locations=[-180,-90, 180, 90])

    #The location specified above gets all tweets, we can then filter and store based on what we want

