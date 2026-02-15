import xml.dom.minidom
import os

svg_path = os.path.join(os.path.dirname(__file__), '../src/assets/smirkcat.svg')

try:
    dom = xml.dom.minidom.parse(svg_path)
    pretty_xml = dom.toprettyxml()
    
    pretty_xml = '\n'.join([line for line in pretty_xml.split('\n') if line.strip()])

    with open(svg_path, 'w', encoding='utf-8') as f:
        f.write(pretty_xml)
    print(f"Successfully formatted {svg_path}")
except Exception as e:
    print(f"Error formatting SVG: {e}")
