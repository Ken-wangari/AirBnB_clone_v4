#!/usr/bin/python3
""" Starts a Flask Web Application """
from models import storage
from models.state import State
from models.city import City
from models.amenity import Amenity
from models.place import Place
from flask import Flask, render_template
import uuid

app = Flask(__name__)

@app.teardown_appcontext
def close_db(error):
    """ Remove the current SQLAlchemy Session """
    storage.close()

@app.route('/101-hbnb/', strict_slashes=False)
def hbnb():
    """ HBNB is alive! """
    states = sorted(storage.all(State).values(), key=lambda s: s.name)
    st_ct = [(state, sorted(state.cities, key=lambda c: c.name)) for state in states]
    amenities = sorted(storage.all(Amenity).values(), key=lambda a: a.name)
    places = sorted(storage.all(Place).values(), key=lambda p: p.name)

    return render_template('0-hbnb.html',
                           states=st_ct,
                           amenities=amenities,
                           places=places,
                           cache_id=uuid.uuid4())

if __name__ == "__main__":
    """ Main Function """
    app.run(host='0.0.0.0', port=5001)

