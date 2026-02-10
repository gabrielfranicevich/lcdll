from pathlib import Path

def consolidate_lines(input_file, output_file):
    """
    Consolidates multi-line questions into single lines.
    """
    with open(input_file, 'r', encoding='utf-8') as f:
        lines = [line.rstrip('\r\n') for line in f.readlines()]
    
    consolidated = []
    current_question = []
    
    for line in lines:
        if line.strip():  # Non-empty line
            current_question.append(line)
            # Check if line ends with punctuation or underscore (end of question)
            if line.endswith(('.', '?', '!')) or '_____' in line or '______' in line or '__________' in line:
                # Join the current question parts with spaces
                full_question = ' '.join(current_question)
                consolidated.append(full_question)
                current_question = []
        else:
            # Empty line - if we have accumulated parts, finalize them
            if current_question:
                full_question = ' '.join(current_question)
                consolidated.append(full_question)
                current_question = []
    
    # Handle any remaining question
    if current_question:
        full_question = ' '.join(current_question)
        consolidated.append(full_question)
    
    # Write to output file
    with open(output_file, 'w', encoding='utf-8') as f:
        for question in consolidated:
            f.write(question + '\n')
    
    print(f"Consolidated {len(lines)} lines into {len(consolidated)} questions.")
    print(f"Output saved to: {output_file}")

if __name__ == "__main__":
    base_dir = Path(__file__).parent.parent
    input_file = base_dir / 'data' / 'negras.json'
    output_file = base_dir / 'data' / 'negras_formatted.json'
    
    consolidate_lines(str(input_file), str(output_file))
    
    # Show first 5 results
    with open(output_file, 'r', encoding='utf-8') as f:
        results = f.readlines()
    
    print("\n--- First 15 formatted questions ---")
    for i, line in enumerate(results[:15], 1):
        print(f"{i}. {line.strip()}")
