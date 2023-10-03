import sys
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
app_config = {"port": sys.argv[1]}

# Only enable debug when running developer mode
if "app.py" in sys.argv[0]:
    app_config["debug"] = True

cors = CORS(app, resources={r"*": {"origins": "http://localhost*"}})


@app.route("/example")
def example():
    return jsonify({"message": "Hello from python!"})


@app.route("/quit")
def quit():
    """Quits Flask on Electron exist"""
    shutdown = request.environ.get("werkzeug.server.shutdown")
    shutdown()
    return


if __name__ == "__main__":
    app.run(**app_config)
