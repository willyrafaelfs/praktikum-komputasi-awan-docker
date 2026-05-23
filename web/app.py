from flask import Flask, render_template, request, redirect
import requests, os

app = Flask(__name__)
API_URL = os.getenv("API_URL", "http://api:8080")

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        nama = request.form.get('nama')
        harga = request.form.get('harga')
        requests.post(f"{API_URL}/barang", json={"nama": nama, "harga": int(harga)})
        return redirect('/')
    
    response = requests.get(f"{API_URL}/barang")
    barangs = response.json() if response.status_code == 200 else []
    return render_template('index.html', barangs=barangs)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)