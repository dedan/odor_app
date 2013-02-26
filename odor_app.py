from flask import Flask, render_template

DEBUG = True
app = Flask(__name__)
app.debug = DEBUG

@app.route('/')
def hello_world():
    return render_template('overview.html')

if __name__ == '__main__':
    app.run()