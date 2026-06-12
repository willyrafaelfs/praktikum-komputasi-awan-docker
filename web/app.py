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
        return redirect('/?success=1')
    
    response = requests.get(f"{API_URL}/barang")
    barangs = response.json() if response.status_code == 200 else []
    return render_template('index.html', barangs=barangs)

@app.route('/edit/<int:id>', methods=['POST'])
def edit_barang(id):
    nama = request.form.get('nama')
    harga = request.form.get('harga')
    requests.put(f"{API_URL}/barang/{id}", json={"nama": nama, "harga": int(harga)})
    return redirect('/?edited=1')

@app.route('/delete/<int:id>', methods=['POST'])
def delete_barang(id):
    requests.delete(f"{API_URL}/barang/{id}")
    return redirect('/?deleted=1')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)