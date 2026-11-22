import json

# Define semantic category affinities
def get_semantic_anchor_category(dead_item):
    name = dead_item['name'].lower()
    cat = dead_item['category'].lower() if dead_item['category'] else ''
    
    # Cleaning / Personal Care / Soap / Dishwash / Detergent -> Pair with Cooking Staples (Rice, Atta, Oil)
    if any(k in name for k in ['cleaner', 'wash', 'soap', 'detergent', 'shampoo', 'paste', 'brush', 'phenyl', 'bleach', 'harpic', 'vim', 'surf', 'ariel', 'comfort', 'sani']):
        return ['rice', 'idli', 'atta', 'oil', 'dosa']
    
    # Masala / Spices / Salt / Papad -> Pair with Cooking Oils / Dals
    if any(k in name for k in ['masala', 'chilli', 'turmeric', 'coriander', 'pepper', 'cumin', 'mustard', 'cardamom', 'clove', 'pattai']):
        return ['oil', 'dal', 'rice']
    
    # Snacks / Biscuits / Bakery / Sweets -> Pair with Tea / Coffee / Milk
    if any(k in name for k in ['biscuit', 'cookie', 'cake', 'rusk', 'chips', 'snack', 'candy', 'chocolate']):
        return ['tea', 'coffee', 'milk']
    
    # Bulk Rice / Ghee -> Pair with Cooking Oil / Dals
    if 'rice' in name or 'ghee' in name:
        return ['oil', 'dal', 'atta', 'sugar']
        
    return ['rice', 'oil', 'dal', 'sugar', 'atta']

print("Loaded semantic affinity rules.")
