import os, pickle
import numpy as np

data_path = os.path.join(os.path.dirname(__file__), '..', 'models')
data = pickle.load(open(os.path.join(data_path, 'predictions.pkl')))


for method in data.keys():
    for receptor in data[method].keys():
        for pred in data[method][receptor]['predictions']:
            if 'oob_prediction' in pred:
                if np.isnan(pred['oob_prediction']['oob_mean']):
                    pred['oob_prediction']['oob_mean'] = 0
                if np.isnan(pred['oob_prediction']['oob_var']):
                    pred['oob_prediction']['oob_var'] = 0

pickle.dump(data, open(os.path.join(data_path, 'predictions.pkl'), 'wb'))
