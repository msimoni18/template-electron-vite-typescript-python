# Electron + Vite + Typescript + Python

Template for building applications with
Electron, Vite, Typescript, and Python.

## Initial setup

Install the npm packages:

```npm install```

Create the virtual environment (assuming python
is already installed):

```python3 -m venv venv```

Activate the virtual environment and install
the packages:

```source venv/bin/activate```

```pip install -r requirements.txt```

Create a local ```.env``` file in the top level
directory containing:

```
FLASK_APP=app.py
FLASK_DEBUG=1
```

## Development

Start the application using:

```npm run start```

## Build

Build the application using:

```npm run build```
