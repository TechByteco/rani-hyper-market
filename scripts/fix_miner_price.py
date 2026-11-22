with open('scripts/basket_sku_velocity_miner.py', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace("COALESCE(tp.Price, p.Price, 0) as Price", "COALESCE(tp.Price, pv.SalesRate, pv.Mrp, 0) as Price")
text = text.replace("COALESCE(tp_recent.AvgPrice, p.Price, 0) as Price", "COALESCE(tp_recent.AvgPrice, pv.SalesRate, pv.Mrp, 0) as Price")

with open('scripts/basket_sku_velocity_miner.py', 'w', encoding='utf-8') as f:
    f.write(text)

print("Fixed Price columns in basket_sku_velocity_miner.py")
