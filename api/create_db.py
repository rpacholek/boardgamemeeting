import os

if not os.path.isfile("database.sqlite"):
    import db
    db.fill()
