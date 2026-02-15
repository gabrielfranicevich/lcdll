import xml.dom.minidom
import re
import sys

def get_svg_bounds(svg_path):
    try:
        doc = xml.dom.minidom.parse(svg_path)
        svg = doc.getElementsByTagName('svg')[0]
        viewbox = svg.getAttribute('viewBox')
        print(f"Current viewBox: {viewbox}")
        
        min_x, min_y = float('inf'), float('inf')
        max_x, max_y = float('-inf'), float('-inf')
        
        min_x, min_y = float('inf'), float('inf')
        max_x, max_y = float('-inf'), float('-inf')
        
        paths = doc.getElementsByTagName('path')
        print(f"Found {len(paths)} paths")
        
        fills = set()
        path_lengths = []
        
        for i, path in enumerate(paths):
            fill = path.getAttribute('fill')
            if fill:
                fills.add(fill)
            d = path.getAttribute('d')
            path_lengths.append((i, len(d), fill))
            
        print(f"Unique fills found: {fills}")
        
        # Sort by length descending
        path_lengths.sort(key=lambda x: x[1], reverse=True)
        print("Top 10 longest paths:")
        for idx, length, fill in path_lengths[:10]:
            print(f"Path {idx}: length={length}, fill={fill}")
            
        return True
    except Exception as e:
        print(f"Error parsing SVG: {e}")
        return False

if __name__ == "__main__":
    get_svg_bounds(sys.argv[1])
