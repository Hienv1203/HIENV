# DataProcessor - Open-Source Data Processing Library

![Tests](https://github.com/Hienv1203/data-processor/actions/workflows/tests.yml/badge.svg)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![Python Version](https://img.shields.io/badge/python-3.8%2B-blue)
![PyPI version](https://img.shields.io/badge/pypi-v1.0.0-blue)

A fast, flexible, and developer-friendly Python library for processing structured data (CSV, JSON, Excel). Perfect for data engineers, analysts, and developers who need clean, efficient data manipulation.

## ✨ Features

- **Multiple Format Support**: CSV, JSON, Excel, Parquet
- **CLI Tool**: Command-line interface for quick data processing
- **Flexible API**: Simple Python API for programmatic use
- **Data Validation**: Built-in schema validation and type checking
- **Aggregation & Filtering**: Powerful data transformation capabilities
- **Performance**: Optimized for large datasets
- **Type Safety**: Full type hints for better IDE support
- **Extensive Documentation**: Comprehensive guides and API docs

## 🚀 Quick Start

### Installation

```bash
pip install data-processor
```

### As a Library

```python
from data_processor import DataProcessor

# Load and process data
processor = DataProcessor()
data = processor.load('data.csv')
filtered = processor.filter(data, {'age': lambda x: x > 25})
result = processor.aggregate(filtered, group_by='city')
processor.save(result, 'output.json')
```

### As a CLI Tool

```bash
# Filter data
data-processor filter --input data.csv --query age=25 --output filtered.json

# Aggregate data
data-processor aggregate --input data.csv --group-by city --output result.json

# Validate schema
data-processor validate --input data.json --schema schema.json
```

## 📚 Documentation

Complete documentation is available at: [docs/](docs/)

- [Installation Guide](docs/installation.md)
- [API Reference](docs/api.md)
- [CLI Guide](docs/cli.md)
- [Examples](docs/examples.md)
- [Contributing Guide](CONTRIBUTING.md)

## 💡 Use Cases

- **Data Pipeline Automation**: Integrate into ETL workflows
- **Data Validation**: Ensure data quality before processing
- **Quick Data Exploration**: CLI for ad-hoc data analysis
- **Data Transformation**: Build complex data transformations
- **Report Generation**: Process data for reports and dashboards

## 🤝 Contributing

We welcome contributions from everyone! Whether it's bug reports, feature requests, or code contributions, your help is appreciated.

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to contribute to this project.

### Development Setup

```bash
# Clone the repository
git clone https://github.com/Hienv1203/data-processor.git
cd data-processor

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install development dependencies
pip install -e ".[dev]"

# Run tests
pytest

# Run linting
black . && flake8 . && mypy .
```

## 📊 Project Stats

- **Open Source**: MIT Licensed
- **Community Driven**: 100+ contributors welcome
- **Active Development**: Regular updates and improvements
- **Well Tested**: 90%+ code coverage

## 🎯 Roadmap

- [ ] Support for additional formats (SQL databases, XML)
- [ ] Web UI for data processing
- [ ] Advanced filtering with complex expressions
- [ ] Parallel processing for large datasets
- [ ] Cloud storage integration (S3, GCS)
- [ ] Python SDK with advanced features

## 📝 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

Special thanks to all our contributors and the open-source community for making this project possible.

## 📞 Support

- **Issues & Bugs**: [GitHub Issues](https://github.com/Hienv1203/data-processor/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Hienv1203/data-processor/discussions)
- **Questions**: Open an issue with the `question` label

---

**Made with ❤️ for the open-source community**
