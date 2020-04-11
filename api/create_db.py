import os
import json
import db

"""
if not os.path.isfile("database.sqlite"):
    import db
    db.fill()
"""

def predefined():
    with open("users.json") as f:
        users = json.load(f)
        for user in users:
            print(user["user"])
            db.create_user(user["user"], user["password"])
        for user in users:
            print("friends", user["user"])
            for friend in users:
                if user["user"] != friend["user"]:
                    db.invite_friend(user["user"], friend["user"])
    with open("games.json") as f:
        games = json.load(f)
        for game in games:
            print(game["official_name"])
            for owner in game["owner"]:
                db.add_game(owner, game["objectid"])

predefined()
