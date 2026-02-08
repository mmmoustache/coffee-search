# Data workflow

1. Export CSV and run the follow command

npm run import /path/to/products.csv

This will:

- upsert products by sku
- compute search_text
- compute embeddings
- update only changed rows
