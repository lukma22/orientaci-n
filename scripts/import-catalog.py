"""Regenera los JSON locales desde el Excel original; no se ejecuta al arrancar.
Requiere Python y openpyxl. Los datos originales no se modifican.
"""
import collections
import json
from pathlib import Path
import openpyxl

ROOT = Path(__file__).resolve().parents[1]
book = openpyxl.load_workbook(ROOT / 'docs/sources/Carreras.xlsx', read_only=True, data_only=True)
DATA = ROOT / 'apps/web/data'
DATA.mkdir(exist_ok=True)
def write(name, data):
    (DATA / name).write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding='utf-8')

places = collections.defaultdict(set)
for row in book['Ingresos'].iter_rows(min_row=2, values_only=True):
    places[row[0]].add(row[1])
assert len(places) == 24 and sum(map(len, places.values())) == 222
write('ecuador.json', {
    'source': 'Carreras.xlsx / Ingresos; nombres del catálogo territorial de la fuente',
    'provinces': [{'name': p, 'cantons': sorted(c)} for p, c in sorted(places.items())],
})
rows = list(book['Maestra'].values)
headers = rows[0]
records = [dict(zip(headers, row)) for row in rows[1:] if row[0]]
write('catalogo-academico.json', {'source': 'Carreras.xlsx / Maestra', 'records': records})
descriptions = {
    'Derecho': ('derecho', 'Explora las normas que organizan la vida en sociedad, la argumentación y la resolución de conflictos. Permite acercarse al análisis de casos, la asesoría jurídica y la defensa de derechos.'),
    'Ciencia de Datos': ('ciencia-de-datos', 'Combina herramientas estadísticas y de programación para explorar datos, reconocer patrones y comunicar resultados. Vincula el razonamiento analítico con preguntas y problemas de distintas áreas.'),
    'Comunicación': ('comunicacion', 'Explora la creación de mensajes, las narrativas y la relación entre organizaciones, medios y públicos. Reúne expresión, análisis y producción de contenidos para distintos contextos.'),
}
careers = []
for name, (slug, description) in descriptions.items():
    offers = [r for r in records if r['Carrera'] == name]
    assert offers, name
    careers.append({'slug': slug, 'name': name, 'description': description, 'offers': offers})
write('carreras-muestra.json', {'selectionMode': 'demo', 'source': 'Carreras.xlsx / Maestra', 'careers': careers})
print(f'Exportados: {len(places)} provincias, 222 cantones, {len(records)} ofertas, 3 fichas de muestra.')
