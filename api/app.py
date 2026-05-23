from flask import Flask, request, jsonify
import psycopg2, os

app = Flask(__name__)

def get_db_connection():
    return psycopg2.connect(
        host=os.getenv("DB_HOST", "db"),
        database=os.getenv("DB_NAME", "barangdb"),
        user=os.getenv("DB_USER", "postgres"),
        password=os.getenv("DB_PASSWORD", "pass123")
    )

def init_db():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS barang (
            id SERIAL PRIMARY KEY,
            nama VARCHAR(100) NOT NULL,
            harga INT NOT NULL
        );
    """)
    conn.commit()
    cur.close()
    conn.close()

@app.route('/barang', methods=['GET'])
def list_barang():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT id, nama, harga FROM barang;")
    rows = cur.fetchall()
    cur.close()
    conn.close()
    return jsonify([{"id": r[0], "nama": r[1], "harga": r[2]} for r in rows])

@app.route('/barang', methods=['POST'])
def add_barang():
    data = request.get_json()
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO barang (nama, harga) VALUES (%s, %s) RETURNING id;",
        (data['nama'], data['harga'])
    )
    id_baru = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({"id": id_baru, "nama": data['nama'], "harga": data['harga']}), 201

if __name__ == '__main__':
    init_db()
    app.run(host='0.0.0.0', port=8080)