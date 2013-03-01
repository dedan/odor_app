from flask import Flask, render_template, jsonify, request
import pickle
import os

DEBUG = True
app = Flask(__name__)
app.debug = DEBUG

data_path = os.path.join(os.path.dirname(__file__), 'models')
data = pickle.load(open(os.path.join(data_path, 'predictions.pkl')))
methods = data.keys()
receptors = data.values()[0].keys()

@app.route('/')
def hello_world():
    # TODO: give overview of available receptors and methods
    return render_template('layout.html', receptors=receptors, methods=methods)

@app.route('/<receptor>/<method>')
def receptor_overview(receptor, method):
    """return all predictions for one receptor method combination"""
    print receptor, method
    predictions = data[method][receptor]['predictions']
    sorted_predictions = sorted(predictions, key=lambda x: x['pred'], reverse=True)
    if request.headers['Content-Type'] == 'application/json':
        return jsonify(predictions=sorted_predictions,
                       q2_score=data[method][receptor]['score'])
    else:
        return render_template('table.html', predictions=sorted_predictions)


if __name__ == '__main__':
    app.run()