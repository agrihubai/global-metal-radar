# Global Metal Radar

Değerli ve Stratejik Metaller Piyasa Panosu (TR / EN) — Altın, Gümüş, Platin, Paladyum, Bakır.

**Canlı:** https://agrihubai.github.io/global-metal-radar/

## Windows'ta test
`baslat.bat` dosyasına çift tıklayın (Python 3.10+ gerekir) veya:
```
pip install -r requirements.txt
python fetch_data.py
python -m http.server 8000
```
Tarayıcı: http://localhost:8000

## GitHub Pages
Settings → Pages → Source: *Deploy from a branch* → `main` / `(root)`.
Settings → Actions → General → Workflow permissions: *Read and write*.
Actions → *Update market data* → *Run workflow* (ilk `data.json` için).

> Bu sayfa yalnızca bilgilendirme amaçlıdır, yatırım tavsiyesi değildir. / For informational purposes only; not investment advice.
