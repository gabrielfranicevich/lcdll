from pathlib import Path

def consolidate_white_cards(input_file, output_file):
    """
    Consolidates multi-line white card entries into single lines.
    White cards in this game are typically 1-3 word phrases, so we'll combine
    lines that appear to be part of the same card.
    """
    with open(input_file, 'r', encoding='utf-8') as f:
        lines = [line.rstrip('\r\n') for line in f.readlines()]
    
    consolidated = []
    current_card = []
    
    for i, line in enumerate(lines):
        if line.strip():  # Non-empty line
            current_card.append(line.strip())
            
            # Check if this looks like the end of a card:
            # - It's a complete phrase (ends with certain patterns)
            # - Or the next line starts with a capital letter (new card)
            # - Or it's the last line
            is_last_line = (i == len(lines) - 1)
            next_starts_capital = False
            
            if i + 1 < len(lines) and lines[i + 1].strip():
                next_line = lines[i + 1].strip()
                # Check if next line starts with capital (likely new card)
                next_starts_capital = next_line[0].isupper()
            
            # Combine if we detect end of card
            if is_last_line or next_starts_capital:
                full_card = ' '.join(current_card)
                consolidated.append(full_card)
                current_card = []
    
    # Handle any remaining card
    if current_card:
        full_card = ' '.join(current_card)
        consolidated.append(full_card)
    
    # Write to output file
    with open(output_file, 'w', encoding='utf-8') as f:
        for card in consolidated:
            f.write(card + '\n')
    
    print(f"Consolidated {len(lines)} lines into {len(consolidated)} white cards.")
    print(f"Output saved to: {output_file}")
    
    return consolidated

if __name__ == "__main__":
    base_dir = Path(__file__).parent.parent
    input_file = base_dir / 'data' / 'blancas.json'
    output_file = base_dir / 'data' / 'blancas_formatted.json'
    
    cards = consolidate_white_cards(str(input_file), str(output_file))
    
    # Show first 30 cards
    print("\n--- First 30 formatted white cards ---")
    for i, card in enumerate(cards[:30], 1):
        print(f"{i}. {card}")
