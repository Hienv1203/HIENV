# API Reference

## Core Classes

### DataProcessor

Main class for data processing operations.

```python
from data_processor import DataProcessor

processor = DataProcessor(verbose=False)
```

**Parameters:**
- `verbose` (bool, optional): Enable verbose logging. Default: False

**Methods:**

#### load

Load data from a file.

```python
data = processor.load(filepath, format=None, **kwargs)
```

**Parameters:**
- `filepath` (str): Path to the data file
- `format` (str, optional): File format (csv, json, xlsx, parquet). Auto-detected if not provided
- `**kwargs`: Additional arguments passed to pandas reader

**Returns:** pandas.DataFrame

**Raises:**
- `FileNotFoundError`: If file doesn't exist
- `FileFormatError`: If format is not supported

**Example:**
```python
data = processor.load('data.csv')
data = processor.load('data.json', format='json')
```

#### save

Save data to a file.

```python
processor.save(data, filepath, format=None, **kwargs)
```

**Parameters:**
- `data` (pd.DataFrame): DataFrame to save
- `filepath` (str): Output file path
- `format` (str, optional): File format. Auto-detected if not provided
- `**kwargs`: Additional arguments passed to pandas writer

**Example:**
```python
processor.save(data, 'output.csv')
processor.save(data, 'output.json', format='json')
```

#### filter

Filter data based on conditions.

```python
filtered_data = processor.filter(data, conditions)
```

**Parameters:**
- `data` (pd.DataFrame): DataFrame to filter
- `conditions` (dict): Dictionary of column:condition pairs

**Returns:** pandas.DataFrame

**Example:**
```python
# Equality filter
result = processor.filter(data, {'city': 'NYC'})

# Callable filter
result = processor.filter(data, {'age': lambda x: x > 25})

# Multiple conditions
result = processor.filter(data, {
    'age': lambda x: x > 25,
    'city': 'NYC'
})
```

#### aggregate

Aggregate data by grouping.

```python
aggregated = processor.aggregate(data, group_by, agg_func=None)
```

**Parameters:**
- `data` (pd.DataFrame): DataFrame to aggregate
- `group_by` (str or list): Column(s) to group by
- `agg_func` (dict, optional): Aggregation functions

**Returns:** pandas.DataFrame

**Example:**
```python
# Simple grouping
result = processor.aggregate(data, group_by='city')

# With aggregation functions
result = processor.aggregate(data, 
    group_by='city',
    agg_func={'age': 'mean', 'salary': 'sum'}
)
```

#### validate_schema

Validate data against schema.

```python
is_valid = processor.validate_schema(data, schema)
```

**Parameters:**
- `data` (pd.DataFrame): DataFrame to validate
- `schema` (dict): Dictionary of column:type pairs

**Returns:** bool

**Raises:** ValidationError if validation fails

#### get_stats

Get statistical summary of data.

```python
stats = processor.get_stats(data)
```

**Returns:** Dictionary with:
- `rows`: Number of rows
- `columns`: Number of columns
- `memory_usage`: Memory usage in MB
- `dtypes`: Data types of each column
- `missing_values`: Missing value count per column

## Exceptions

### DataProcessorError

Base exception for all DataProcessor errors.

```python
from data_processor import DataProcessorError

try:
    processor.load('data.csv')
except DataProcessorError as e:
    print(f"Error: {e}")
```

### FileFormatError

Raised when file format is not supported.

### ValidationError

Raised when data validation fails.

### FilterError

Raised when filter operation fails.
