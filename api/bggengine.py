
import boardgamegeek


board_game_type = boardgamegeek.api.BGGRestrictSearchResultsTo.BOARD_GAME


def get_game(search_str):
    client = boardgamegeek.BGGClient()
    print(search_str)
    try:
        # jesli tutaj sie uda, to super
        board_game = client.game(search_str)
    
    except boardgamegeek.BGGItemNotFoundError:
        # a jesli wejdzie tutaj, to sortowanie jest zle
        search_results = client.search(search_str, search_type=[board_game_type])
        # wybieranie pierwszego elemetu jest slabe
        game_id = search_results[0].id
        # ale przynajmniej cos znajduje
        board_game = client.game(game_id=game_id)
    
    return board_game

def search(search_str):
    client = boardgamegeek.BGGClient()
    games = []
    try:
        games = [client.game(search_str)]
    except boardgamegeek.BGGItemNotFoundError:
        pass

    search_results = client.search(search_str, search_type=[board_game_type])
    return games + [client.game(game_id=game.id) for game in search_results[:2] if not games or game.id != games[0].id ]

def search_output(game):
    client = boardgamegeek.BGGClient()
    return {
            "id": game.id,
            "name": game.name,
            "image": game.image
            }

def get_game_details(gameid):
    client = boardgamegeek.BGGClient()
    game = client.game(game_id=gameid)
    return {
            "id": game.id,
            "name": game.name,
            "rating": game.rating_average,
            "weight": game.rating_average_weight,
            "min_players": game.min_players,
            "max_players": game.max_players,
            "time": game.playing_time,
            "image": game.image
        }
