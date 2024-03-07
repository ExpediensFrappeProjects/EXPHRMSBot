from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import requests
from requests.exceptions import RequestException

RASA_API_URL = 'http://localhost:5005/webhooks/rest/webhook'

app = Flask(__name__, static_folder='static')
CORS(app)

@app.route('/webhook', methods=['POST'])
def webhook():
    try:
        user_message = request.json.get('message')
        sender_id = request.json.get('sender') 

        print("Sender ID:", sender_id)
        print("User message:", user_message)

        rasa_response = requests.post(RASA_API_URL, json={'message': user_message, 'sender': sender_id})
        rasa_response.raise_for_status()

        print("Rasa response:", rasa_response.json())

        return jsonify(rasa_response.json())

    except RequestException as e:
        print("Error:", str(e))
        return jsonify({'error': str(e)}), 500

    

@app.route('/api/user', methods=['POST'])
def store_user_data():
    data = request.json
    print(data) 
    return jsonify({"message": "Data Received"}), 200



@app.route('/')
def index():
    return render_template('index.html')  

if __name__ == "__main__":
    app.run(host='192.168.20.106', port=3000)