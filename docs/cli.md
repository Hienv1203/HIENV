# CLI Guide

DataProcessor includes a powerful command-line interface (CLI) for data processing tasks.

## Installation

After installing DataProcessor, the CLI is available as:

```bash
data-processor [COMMAND] [OPTIONS]
```

## Commands

### convert

Convert data between different formats.

```bash
data-processor convert --input data.csv --output data.json
```

**Options:**
- `--input, -i` (required): Input file path
- `--output, -o` (required): Output file path
- `--format, -f` (optional): Output format (auto-detected if omitted)

**Examples:**
```bash
# CSV to JSON
data-processor convert -i data.csv -o data.json

# JSON to Excel
data-processor convert -i data.json -o data.xlsx -f xlsx

# Any to Parquet
data-processor convert -i data.csv -o data.parquet -f parquet
```

### aggregate

Group and aggregate data.

```bash
data-processor aggregate --input data.csv --column city --output result.json
```

**Options:**
- `--input, -i` (required): Input file path
- `--column, -c` (required): Column to group by
- `--output, -o` (required): Output file path
- `--format, -f` (default: json): Output format

**Examples:**
```bash
# Group by city
data-processor aggregate -i data.csv -c city -o result.json

# Export as CSV
data-processor aggregate -i data.csv -c department -o result.csv -f csv
```

### filter

Filter data by column value.

```bash
data-processor filter --input data.csv --column city --value NYC --output filtered.json
```

**Options:**
- `--input, -i` (required): Input file path
- `--column, -c` (required): Column name
- `--value, -v` (required): Value to match
- `--output, -o` (required): Output file path

**Examples:**
```bash
# Filter by string value
data-processor filter -i data.csv -c city -v NYC -o filtered.json

# Save as CSV
data-processor filter -i data.csv -c status -v active -o active.csv
```

### inspect

Display detailed information about a data file.

```bash
data-processor inspect --input data.csv
```

**Options:**
- `--input, -i` (required): Input file path

**Output:**
```
📊 Data Statistics
Rows: 1000
Columns: 5
Memory: 0.25 MB

Column Types:
  - name: object
  - age: int64
  - city: object
  - salary: float64
  - join_date: object

Missing Values:
  - age: 5
  - salary: 2
```

## Exit Codes

- `0`: Success
- `1`: Error

## Getting Help

```bash
# Show help for all commands
data-processor --help

# Show help for specific command
data-processor convert --help
data-processor aggregate --help
data-processor filter --help
data-processor inspect --help
```

## Examples

### Data Processing Pipeline

```bash
# 1. Filter data
data-processor filter -i raw_data.csv -c status -v active -o active.csv

# 2. Aggregate by region
data-processor aggregate -i active.csv -c region -o regional_summary.json

# 3. Convert to Excel
data-processor convert -i regional_summary.json -o report.xlsx

# 4. Inspect final result
data-processor inspect -i report.xlsx
```

### Batch Processing

```bash
# Convert multiple files
for file in *.csv; do
  data-processor convert -i "$file" -o "${file%.csv}.json"
done
```
