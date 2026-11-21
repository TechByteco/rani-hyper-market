with open('api/index.js', 'r', encoding='utf-8') as f:
    code = f.read()

old_block = """          dates: {
            '2023': f.datesByYear?.['2023']?.date || '-',
            '2024': f.datesByYear?.['2024']?.date || '-',
            '2025': f.datesByYear?.['2025']?.date || '-',
            '2026': f.datesByYear?.['2026']?.date || '-',
            '2027': f.datesByYear?.['2027']?.date || '-'
          },
          cutoff2026: f.datesByYear?.['2026']?.cutoff || f.datesByYear?.['2027']?.cutoff || f.procurementCutoff || '-'"""

new_block = """          dates: {
            '2022': f.datesByYear?.['2022']?.date || (typeof f.datesByYear?.['2022'] === 'string' ? f.datesByYear['2022'] : '-'),
            '2023': f.datesByYear?.['2023']?.date || (typeof f.datesByYear?.['2023'] === 'string' ? f.datesByYear['2023'] : '-'),
            '2024': f.datesByYear?.['2024']?.date || (typeof f.datesByYear?.['2024'] === 'string' ? f.datesByYear['2024'] : '-'),
            '2025': f.datesByYear?.['2025']?.date || (typeof f.datesByYear?.['2025'] === 'string' ? f.datesByYear['2025'] : '-'),
            '2026': f.datesByYear?.['2026']?.date || f.date2026 || (typeof f.datesByYear?.['2026'] === 'string' ? f.datesByYear['2026'] : '-'),
            '2027': f.datesByYear?.['2027']?.date || (typeof f.datesByYear?.['2027'] === 'string' ? f.datesByYear['2027'] : '-'),
            '2028': f.datesByYear?.['2028']?.date || (typeof f.datesByYear?.['2028'] === 'string' ? f.datesByYear['2028'] : '-')
          },
          date2026: f.date2026 || f.datesByYear?.['2026']?.date || '-',
          cutoff2026: f.cutoff2026 || f.datesByYear?.['2026']?.cutoff || f.datesByYear?.['2027']?.cutoff || f.procurementCutoff || '-'"""

if old_block in code:
    code = code.replace(old_block, new_block, 1)
    with open('api/index.js', 'w', encoding='utf-8') as f:
        f.write(code)
    print("Successfully patched matrix fallback in api/index.js!")
else:
    print("Warning: old_block not found in api/index.js")
