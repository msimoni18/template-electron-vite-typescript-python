from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
cors = CORS(app, resources={r"*": {"origins": "http://localhost*"}})

@app.route("/example")
def example():
    return jsonify("Hello from python!")

@app.route("/quit")
def quit():
    """Quits Flask on Electron exist"""
    shutdown = request.environ.get("werkzeug.server.shutdown")
    shutdown()
    return
