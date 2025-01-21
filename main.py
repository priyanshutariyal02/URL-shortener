from flask import Flask, render_template, redirect, request, jsonify
import random
import string
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

shortened_urls = {}

def generate_short_url(length=6):
    chars = string.ascii_letters + string.digits
    short_url = "".join(random.choice(chars) for _ in range(length))
    return short_url

@app.route("/", methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        long_url = request.form.get('long_url')
        if not long_url:
            return jsonify({"error": "Invalid URL"}), 400
        short_url = generate_short_url()
        while short_url in shortened_urls:
            short_url = generate_short_url()
        shortened_urls[short_url] = long_url
        return jsonify({
            "short_url": f"{request.url_root}{short_url}",
            "long_url": long_url
        })
    return render_template("index.html")

@app.route("/<short_url>")
def redirect_url(short_url):
    long_url = shortened_urls.get(short_url)
    if long_url:
        return redirect(long_url)
    else:
        return "URL not found!", 404

if __name__ == "__main__":
    app.run(debug=True)
