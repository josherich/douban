# PaperReads Back-End

### 1. crawl arxiv or pdf

run:

```
python crawl_sites.py --page_uri=http://www.abc.com --depth=3 --output_dir=data
```

output:

```
- data
  - pdf/
  - txt/
  - [sites]/
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

### 4. extract meta

```
java -Xmx1G -jar grobid-core/build/libs/grobid-core-0.5.5-onejar.jar -gH grobid-home -dIn ../paper-reads-pdf/data/cims.nyu.edu -dOut ../paper-reads-pdf/data/cims.nyu.edu.meta/ -r -exe processHeader
```

### 5. import
```
npx babel-node lib/scripts/import.js ../../paper-reads-pipeline/data
```
