# Examples

## Basic Usage

### Load and Save Data

```python
from data_processor import DataProcessor

processor = DataProcessor()

# Load CSV
data = processor.load('customers.csv')

# Save as JSON
processor.save(data, 'customers.json')

# Save as Excel
processor.save(data, 'customers.xlsx')
```

### Filter Data

```python
# Filter by exact value
nyc_customers = processor.filter(data, {'city': 'NYC'})

# Filter with condition
young_customers = processor.filter(data, {
    'age': lambda x: x < 30
})

# Multiple conditions
high_value_customers = processor.filter(data, {
    'city': 'NYC',
    'purchase_total': lambda x: x > 1000
})
```

### Aggregate Data

```python
# Simple grouping - count records per city
by_city = processor.aggregate(data, group_by='city')

# Multiple aggregations
summary = processor.aggregate(data, 
    group_by='city',
    agg_func={
        'salary': ['mean', 'min', 'max'],
        'id': 'count'
    }
)

# Group by multiple columns
by_city_dept = processor.aggregate(data, 
    group_by=['city', 'department'],
    agg_func={'salary': 'mean'}
)
```

## Real-World Use Cases

### ETL Pipeline

```python
from data_processor import DataProcessor

processor = DataProcessor(verbose=True)

# 1. Load raw data
raw_data = processor.load('raw_sales.csv')

# 2. Clean and filter
active_sales = processor.filter(raw_data, {
    'status': 'completed',
    'amount': lambda x: x > 0
})

# 3. Aggregate by region
regional_summary = processor.aggregate(active_sales,
    group_by='region',
    agg_func={'amount': 'sum', 'id': 'count'}
)

# 4. Save result
processor.save(regional_summary.reset_index(), 
               'regional_report.json')
```

### Data Validation Pipeline

```python
from data_processor import DataProcessor
from data_processor.exceptions import ValidationError

processor = DataProcessor()

# Load data
data = processor.load('customers.csv')

# Define schema
expected_schema = {
    'id': 'int64',
    'name': 'object',
    'email': 'object',
    'age': 'int64',
}

# Validate
try:
    processor.validate_schema(data, expected_schema)
    print("✓ Data validation passed")
except ValidationError as e:
    print(f"✗ Validation failed: {e}")
```

### Data Analysis

```python
processor = DataProcessor()
data = processor.load('sales.csv')

# Get statistics
stats = processor.get_stats(data)

print(f"Total records: {stats['rows']}")
print(f"Memory usage: {stats['memory_usage']:.2f} MB")
print(f"Missing values: {stats['missing_values']}")

# Analyze by category
by_category = processor.aggregate(data,
    group_by='category',
    agg_func={
        'amount': ['sum', 'mean', 'count'],
        'profit': 'mean'
    }
)

print(by_category)
```

### Batch File Processing

```python
from pathlib import Path
from data_processor import DataProcessor

processor = DataProcessor(verbose=True)

# Process all CSV files in a directory
for csv_file in Path('data/').glob('*.csv'):
    print(f"\nProcessing: {csv_file.name}")
    
    # Load
    data = processor.load(str(csv_file))
    
    # Filter invalid records
    valid_data = processor.filter(data, {
        'status': 'valid'
    })
    
    # Save cleaned data
    output_file = f"clean/{csv_file.stem}_clean.json"
    processor.save(valid_data, output_file)
```

## CLI Examples

### Quick Data Inspection

```bash
# Check file structure and stats
data-processor inspect sales.csv
```

### Format Conversion

```bash
# CSV → JSON
data-processor convert -i data.csv -o data.json

# JSON → Excel
data-processor convert -i data.json -o data.xlsx

# Multiple files
for f in *.csv; do
    data-processor convert -i "$f" -o "${f%.csv}.json"
done
```

### Data Filtering

```bash
# Filter and convert in one go
data-processor filter -i all_sales.csv -c status -v completed \
    | data-processor convert --format json
```

### Generate Reports

```bash
# Create a regional summary
data-processor aggregate -i sales.csv -c region -o regional_stats.json

# Generate a list of active users
data-processor filter -i users.csv -c status -v active -o active_users.json
```
