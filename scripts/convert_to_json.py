import json
from pathlib import Path

def convert_text_to_json(input_file, output_file, filter_questions=False):
    """
    Convierte archivo de texto (una entrada por línea) a formato JSON array.
    
    Args:
        input_file: Archivo de entrada
        output_file: Archivo de salida JSON
        filter_questions: Si es True, filtra líneas que parecen preguntas (contienen ___)
    """
    with open(input_file, 'r', encoding='utf-8') as f:
        lines = [line.strip() for line in f.readlines()]
    
    # Filtrar líneas vacías
    lines = [line for line in lines if line]
    
    # Si filter_questions está activo, quitar líneas con "___"
    if filter_questions:
        original_count = len(lines)
        lines = [line for line in lines if '___' not in line]
        filtered_count = original_count - len(lines)
        if filtered_count > 0:
            print(f"  ⚠️  Filtradas {filtered_count} preguntas (black cards) del archivo de blancas")
    
    # Escribir como JSON con formato legible
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(lines, f, ensure_ascii=False, indent=2)
    
    print(f"✅ Convertido: {len(lines)} entradas → {output_file}")
    return lines

if __name__ == "__main__":
    base_dir = Path(__file__).parent.parent / 'data'
    
    print("\n📝 Convirtiendo archivos a formato JSON...\n")
    
    # Convertir negras (preguntas/black cards)
    negras_input = base_dir / 'negras.json'
    negras_output = base_dir / 'negras.json'
    negras = convert_text_to_json(str(negras_input), str(negras_output))
    
    # Convertir blancas (respuestas/white cards) - filtrar preguntas
    blancas_input = base_dir / 'blancas.json'
    blancas_output = base_dir / 'blancas.json'
    blancas = convert_text_to_json(str(blancas_input), str(blancas_output), filter_questions=True)
    
    print(f"\n✨ Archivos JSON creados:")
    print(f"   • negras.json: {len(negras)} preguntas")
    print(f"   • blancas.json: {len(blancas)} respuestas")
