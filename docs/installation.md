# Installation Guide

## From PyPI (Recommended)

Install the latest stable release:

```bash
pip install data-processor
```

## From Source

Clone the repository and install in development mode:

```bash
git clone https://github.com/Hienv1203/data-processor.git
cd data-processor
pip install -e .
```

## Development Installation

If you want to contribute to development:

```bash
git clone https://github.com/Hienv1203/data-processor.git
cd data-processor
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -e ".[dev]"
```

## Dependencies

- pandas >= 1.3.0
- openpyxl >= 3.0.0
- click >= 8.0.0
- pydantic >= 2.0.0

## Python Version Support

DataProcessor requires Python 3.8 or higher.

- Python 3.8
- Python 3.9
- Python 3.10
- Python 3.11
- Python 3.12

## Verify Installation

Verify the installation by checking the version:

```bash
python -c "import data_processor; print(data_processor.__version__)"
```

Or use the CLI:

```bash
data-processor --version
```
