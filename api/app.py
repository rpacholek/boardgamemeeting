from flask import Flask, request
from flask_jwt import JWT, jwt_required, current_identity, _jwt_required
from flask_cors import CORS
from werkzeug.security import safe_str_cmp
import json
import hashlib

import bggengine
import db


def authenticate(username, password):
    return db.get_user(username, password)

def identity(payload):
    user_id = payload['identity']
    return db.get_user_by_id(user_id).name

app = Flask(__name__)
app.debug = True
app.config['SECRET_KEY'] = 'super-secret'
CORS(app)

jwt = JWT(app, authenticate, identity)

@app.route('/api/games')
@jwt_required()
def game_list():
    return json.dumps(db.list_games(current_identity))

@app.route('/api/search', methods=['POST'])
@jwt_required()
def game_search():
    print(request.data)
    query = json.loads(request.data)["search"]
    result = list( map( bggengine.search_output, bggengine.search(query)))
    return json.dumps(result)

@app.route('/api/user/game', methods=['POST', 'PUT', 'DELETE'])
@jwt_required()
def add_user_game():
    if request.method == 'POST':
        "Add"
    elif request.method == 'PUT':
        "Update"
    elif request.method == 'DELETE':
        "Delete"

@app.route('/api/user/games', methods=['GET'])
@jwt_required()
def list_user_game():
    return json.dumps(db.list_user_games(current_identity))

@app.route('/api/user/friends')
@jwt_required()
def list_friends():
    pass

@app.route('/api/user/invitations', methods=['GET', 'POST'])
@jwt_required()
def list_invitations():
    pass

@app.route('/api/user/invitations/<inv_id>', methods=['POST', 'DELETE'])
@jwt_required()
def handle_invitation(inv_id):
    pass

if __name__ == '__main__':
    app.run()

