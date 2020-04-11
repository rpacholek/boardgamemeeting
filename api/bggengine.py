
import boardgamegeek


client = boardgamegeek.BGGClient()
board_game_type = boardgamegeek.api.BGGRestrictSearchResultsTo.BOARD_GAME


def get_game(search_str):
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
    games = []
    try:
        games = [client.game(search_str)]
    except boardgamegeek.BGGItemNotFoundError:
        pass

    search_results = client.search(search_str, search_type=[board_game_type])
    return games + [client.game(game_id=game.id) for game in search_results[:5]]

def search_output(game):
    return {
            "id": game.id,
            "name": game.name,
            "image": game.image
            }
