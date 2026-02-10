import json
from bs4 import BeautifulSoup
import re

def extract_class_a_spans(html_content):
    """
    Extrae todo el texto de los spans con class="a" que están dentro de elementos con id="outer_page_N"
    """
    soup = BeautifulSoup(html_content, 'html.parser')
    
    # Buscar todos los divs con id que coincida con el patrón "outer_page_N"
    outer_pages = soup.find_all('div', id=re.compile(r'^outer_page_\d+$'))
    
    extracted_texts = []
    
    for page in outer_pages:
        page_id = page.get('id')
        # Encontrar todos los spans con class="a" dentro de este div
        spans = page.find_all('span', class_='a')
        
        for span in spans:
            text = span.get_text(strip=True)
            # Solo agregar si el texto no está vacío y no es solo espacios
            if text and text != '\xa0':  # \xa0 es &nbsp;
                extracted_texts.append(text)
    
    return extracted_texts

def process_file(input_file, output_file):
    """
    Procesa el archivo de entrada y guarda los textos extraídos en el archivo de salida
    """
    # Leer el archivo
    with open(input_file, 'r', encoding='utf-8') as f:
        html_content = f.read()
    
    # Extraer textos
    texts = extract_class_a_spans(html_content)
    
    # Guardar en archivo de salida
    with open(output_file, 'w', encoding='utf-8') as f:
        for text in texts:
            f.write(text + '\n')
    
    print(f"Se extrajeron {len(texts)} textos.")
    print(f"Guardados en: {output_file}")
    
    return texts

if __name__ == "__main__":
    from pathlib import Path
    
    # Archivos de entrada y salida
    base_dir = Path(__file__).parent.parent
    input_file = base_dir / 'data' / 'negras.json'
    output_file = base_dir / 'data' / 'negras_extracted.txt'
    
    texts = process_file(str(input_file), str(output_file))
    
    # Mostrar los primeros 10 resultados como ejemplo
    print("\n--- Primeros 10 textos extraídos ---")
    for i, text in enumerate(texts[:10], 1):
        print(f"{i}. {text}")
