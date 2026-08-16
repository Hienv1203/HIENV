# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-01-01

### Added
- Initial release of DataProcessor
- Core DataProcessor class with basic functionality
- Support for CSV, JSON, Excel, and Parquet formats
- Command-line interface (CLI) tool
- Data filtering with equality and callable conditions
- Data aggregation with grouping
- Data validation capabilities
- Comprehensive documentation and examples
- Full test suite with 90%+ coverage
- GitHub Actions CI/CD workflows
- Contributing guidelines and code of conduct

### Features
- `load()` - Load data from multiple formats
- `save()` - Save data to multiple formats
- `filter()` - Filter data with flexible conditions
- `aggregate()` - Group and aggregate data
- `validate_schema()` - Validate data structure
- `get_stats()` - Get statistical summaries
- CLI commands: convert, aggregate, filter, inspect

### Security
- No known security vulnerabilities

---

## [Unreleased]

### Planned Features
- Support for SQL database connections
- Advanced filtering with complex expressions
- Parallel processing for large datasets
- Web UI for data processing
- Cloud storage integration (S3, GCS)
- Python SDK with advanced features
- Streaming data support

### Under Development
- Performance optimizations
- Additional input/output format support
- Extended documentation

---

For detailed information about each release, see [GitHub Releases](https://github.com/Hienv1203/data-processor/releases).
