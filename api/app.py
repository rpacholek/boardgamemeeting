from flask import Flask, request
from flask_jwt import JWT, jwt_required, current_identity 
from flask_cors import CORS
import json
import hashlib
import datetime

import bggengine
import db


def authenticate(username, password):
    print(username, password)
    return db.get_user(username, password)

def identity(payload):
    print(payload)
    user_id = payload['identity']
    return db.get_user_by_id(user_id).name

app = Flask(__name__)
app.debug = True
app.config['SECRET_KEY'] = 'super-secret'
app.config['JWT_EXPIRATION_DELTA'] = datetime.timedelta(hours=1)
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

@app.route('/api/user/game/<gameid>', methods=['PUT', 'DELETE'])
@jwt_required()
def edit_user_game(gameid):
    if request.method == 'PUT':
        data = json.loads(request.data)
        db.update_game(current_identity, gameid, data["status"])
    elif request.method == 'DELETE':
        db.delete_game(current_identity, gameid)
    return "Ok"

@app.route('/api/user/game', methods=['POST'])
@jwt_required()
def add_user_game():
    data = json.loads(request.data)
    print(data)
    if request.method == 'POST':
        db.add_game(current_identity, data["id"], data["status"])
    return "Ok"

@app.route('/api/user/games', methods=['GET'])
@jwt_required()
def list_user_game():
    return json.dumps(db.list_user_games(current_identity))

@app.route('/api/user/friends', methods=['GET'])
@jwt_required()
def friends():
    return json.dumps(db.friends_list(current_identity))

@app.route('/api/user/friends/<friend>', methods=['DELETE'])
@jwt_required()
def delete_friend(friend):
    db.friends_remove(current_identity, friend)
    return 'OK'

@app.route('/api/user/invitations', methods=['GET', 'POST'])
@jwt_required()
def list_invitations():
    if request.method == 'GET':
        return json.dumps(db.invitations_list(current_identity))
    elif request.method == 'POST':
        data = json.loads(request.data)
        db.invite_friend(current_identity, data['friend'])
    return 'OK'

@app.route('/api/user/invitations/<inv_id>', methods=['POST', 'DELETE'])
@jwt_required()
def handle_invitation(inv_id):
    if request.method == 'POST':
        db.invite_accept(current_identity, inv_id)
    elif request.method == 'DELETE':
        db.invite_decline(current_identity, inv_id)
    return 'OK'

@app.route('/api/user/password', methods=['POST'])
@jwt_required()
def change_password():
    print(request.data)
    data = json.loads(request.data)
    password = data.get("password", None)
    if password:
        db.change_password(current_identity, password)
    return 'OK'

@app.route('/api')
def alive_check():
    return "I am alive"

if __name__ == '__main__':
    app.run()

