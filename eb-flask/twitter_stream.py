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
        parse_data(data)
        return(True)

    def on_error(self, status):
        print(status)

def parse_data(data):
    json_data_file = json.loads(data)
    contents = json_data_file['text']

    # Create elastic search object here

    # Get the keywords from the elastic search object

    # if the received tweet contains any of the keywords, then parse the tweet for its
    # coordinates, and insert it into the EB object with needed information like id,
    # datetime, timestamp, author, screen_name

    # you might wanna check these out when you parse the tweet:
    # https://dev.twitter.com/overview/api/places - coordinates
    # https://dev.twitter.com/overview/api/users - most of other info
    # Complete JSON_FORMAT: https://dev.twitter.com/rest/reference/get/search/tweets

    location = json_data_file["place"]
    coordinates = json_data_file["coordinates"]
    # print(location)
    # print(data);
    if coordinates is not None:
        print(json_data_file["coordinates"])
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

# the "car" in the track statement below is what we'll change to the required imput search keyword

if __name__ == '__main__':
    # listener = StdOutListener()
    auth = tweepy.OAuthHandler(consumerKey, consumerSecret)
    auth.set_access_token(accessToken, accessSecret)
    twitterStream = Stream(auth, listener())
    twitterStream.filter(track=["car"])













    # for friend in tweepy.Cursor(api.friends).items():
    #     process_or_store(friend._json)

    # stream = Stream(auth, listener)
    # stream.filter(track=['#nyc'])
