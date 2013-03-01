#!/usr/bin/env python
# encoding: utf-8
"""

Created by  on 2012-01-27.
Copyright (c) 2012. All rights reserved.
"""
import unittest, sys, os
import odor_app
import json

class TestJsonApi(unittest.TestCase):

    def setUp(self):
        self.app = odor_app.app.test_client()
        self.test_path = '/Or22a/eva_100'

    def test_receptor_method_overview(self):
        rv = self.app.get(self.test_path, content_type='application/json')
        data = json.loads(rv.data)
        self.assertIn('pred', data['predictions'][0])
        self.assertIn('q2_score', data)

    def test_predictions_sorted(self):
        """make sure the predictions are sorted correctly"""
        rv = self.app.get(self.test_path, content_type='application/json')
        data = json.loads(rv.data)
        maximum = data['predictions'][0]['pred']
        for p in data['predictions']:
            self.assertGreaterEqual(maximum, p['pred'])


if __name__ == '__main__':
    unittest.main()