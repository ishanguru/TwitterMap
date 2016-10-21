# This is the file where we connect to ES + find and insert data

from elasticsearch import Elasticsearch

HOSTADDRESS = ''
USERNAME = ''
PASSWORD = ''
PORT = ''

class ElasticSearchServices:

    def __init__(self):
        self.es = Elasticsearch(
        		[HOSTADDRESS],
        		http_auth=(USERNAME,PASSWORD),
        		port=PORT
        	)

    def store_data(self, index, doc_type, body):
    	results = self.es.index(
    			index=index, 
    			doc_type=doc_type, 
    			body=body
    		)

    def search(self, index, doc_type, body, size):
    	results = self.es.search(
    			index = index,
    			doc_type = doc_type,
    			body = body,
    			size = size
    		)

    	return results;

    def total_hits(results):
    	return results['hits']['total']