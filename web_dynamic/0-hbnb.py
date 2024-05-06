#!/usr/bin/python3
"""Starts a Flask Web Application"""

from flask import Flask, render_template
from models import storage
from models.state import State
from models.amenity import Amenity
from models.place import Place
import uuid

app = Flask(__name__)


@app.teardown_appcontext
def close_db(error):
    """Closes the database session"""
    storage.close()


@app.route('/0-hbnb', strict_slashes=False)
def hbnb():
    """Renders the HBNB template with data"""
    states = storage.all(State).values()
    states = sorted(states, key=lambda state: state.name)
    state_cities = [[state, sorted(state.cities, key=lambda city: city.name)]
                    for state in states]
    amenities = sorted(storage.all(Amenity).values(), key=lambda amenity: amenity.name)
    places = sorted(storage.all(Place).values(), key=lambda place: place.name)
    cache_id = uuid.uuid4()
    return render_template('0-hbnb.html',
                           states=state_cities,
                           amenities=amenities,
                           places=places,
                           cache_id=cache_id)


if __name__ == "__main__":
    app.run(host='0.0.0.0', port='5000')

