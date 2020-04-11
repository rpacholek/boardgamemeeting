from pony.orm import *
from decimal import Decimal
from collections import defaultdict
import hashlib
from bggengine import *

def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

db = Database()

class Games(db.Entity):
    id = PrimaryKey(int)
    name = Required(str)
    image = Optional(str)

    users = Set('UserGames', reverse='game')

    #Stats
    time = Required(int)
    min_players = Required(int)
    max_players = Required(int)
    rating = Required(Decimal, 2, 2)
    weight = Required(Decimal, 2, 2)

    def get_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "image": self.image,
            "time": self.time,
            "min_players": self.min_players,
            "max_players": self.max_players,
            "rating": float(self.rating),
            "weight": float(self.weight),
        }

class UserGames(db.Entity):
    id = PrimaryKey(int, auto=True)
    game = Required('Games', reverse='users')
    user = Required('Users', reverse='games')

    # Status
    possesed = Required(bool, default=True)
    in_delivery = Required(bool, default=False)
    on_radar = Required(bool, default=False)
    new = Required(bool, default=False)
    not_available = Required(bool, default=False)

    # Date

    def status(self):
        return {
            "possesed": self.possesed,
            "in_delivery": self.in_delivery,
            "on_radar": self.on_radar,
            "new": self.new,
            "not_available": self.not_available
        }

class Users(db.Entity):
    id = PrimaryKey(int, auto=True)
    name = Required(str, unique=True)
    password = Required(str)
    # name = Required(str) #?

    friends = Set('Users', reverse='friends')
    invitations = Set('Users', reverse='invitations')
    games = Set('UserGames', reverse='user')


db.bind(provider='sqlite', filename='database.sqlite', create_db=True)
db.generate_mapping(create_tables=True)

@db_session
def fill():
    u1 = Users(name='User3', password=hash_password('test'))
    u2 = Users(name='User2', password=hash_password('test'), friends=[u1])
    u3 = Users(name='user1', password=hash_password('abcxyz'), friends=[u1, u2])

    commit()

    add_game(u1.name, 28720) # Brass: Lancashire
    add_game(u1.name, 2651) # Power grid
    add_game(u2.name, 192291)
    add_game(u2.name, 124361)
    add_game(u3.name, 21241)


@db_session
def create_user(name, password):
    Users(name=name, password=hash_password(password))

@db_session
def get_user(name, password):
    return Users.get(name=name, password=hash_password(password))

@db_session
def get_user_by_id(userid):
    return Users.get(id=userid)

@db_session
def add_game(user, game_id, status={}):
    game = Games.get(id=game_id)
    if not game:
        game = Games(**get_game_details(game_id))
    user = Users.get(name=user)

    UserGames(user=user, game=game, **status)

@db_session
def remove_game(user, game_id):
    pass

@db_session
def update_game(user, game_id, status):
    pass

@db_session
def invite_friend(user, name):
    pass

@db_session
def invite_accept(user, name):
    pass

@db_session
def invite_decline(user, name):
    pass

@db_session
def list_user_games(user):
    usergames = select(game for game in Users.get(name=user).games)
    return get_user_games(usergames)

def get_user_games(usergames, **kwargs):
    games = []
    for usergame in usergames:
        games.append({
            "info": usergame.game.get_dict(),
            "status": usergame.status(),
            **kwargs
        })
    return games

def merge_owners(games):
    game_dict = {}
    game_owners = defaultdict(list)

    for game in games:
        gid = game["info"]["id"]
        if gid not in game_dict:
            game_dict[gid] = game["info"]
        game_owners[gid].append(game["owner"])

    return [ {**game_dict[key], "owners": game_owners[key]} for key in game_dict.keys() ]


@db_session
def list_games(user):
    """
    List user games and his friends
    """
    user = Users.get(name=user)

    games = get_user_games(user.games, owner=user.name)
    for friend in user.friends:
        games += get_user_games(friend.games, owner=friend.name)
    
    return merge_owners(games)
