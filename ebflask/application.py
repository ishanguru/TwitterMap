import json
import thread
from flask import Flask
from TweetListener import *
from TweetHandler import TwitterHandler

# function that pulls tweets from twitter
def startTwitterRequests():
    startStream()

# EB looks for an 'application' callable by default.
app = Flask(__name__)

@app.route('/')
def api_root():
    return 'Welcome'

@app.route('/search/<keyword>')
def searchKeyword(keyword):
    searchTweets = TwitterHandler()
    result = searchTweets.getTweets(keyword)
    return json.dumps(result)

# run the app.
if __name__ == "__main__":
    # Setting debug to True enables debug output. This line should be
    # removed before deploying a production app.
    thread.start_new_thread(startTwitterRequests, ())
    app.debug = True
    app.run()