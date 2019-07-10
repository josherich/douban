# PaperReads Back-End

### 1. crawl arxiv or pdf

run:

```
import crawler

site = "https://www.cs.cmu.edu/~odonnell/quantum18/"
depth = 3
output_dir = "crawling_test"

crawler.crawl(url=site, depth=depth, output_dir=output_dir, method="normal")
```

output:

```
- data
  - pdf
  - txt
```

### 2. extract text

run:

```
python parse_pdf_to_text.py
```

output:

```
- data
  - pdf
  - txt/*.txt
```

### 3. compute tdidf

run:

```
python analyze.py
```

output:

```
- data
  - pdf
  - txt
  - list.csv
```

### 4. import
```
npx babel-node lib/scripts/import.js ../../paper-reads-pipeline/data
```
