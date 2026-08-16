# Data Processor

A comprehensive open-source Python library for processing structured data with support for CSV, JSON, Excel, and Parquet formats.

## Quick Links

- 📖 **Documentation**: [docs/](docs/)
- 🐛 **Issues**: [GitHub Issues](https://github.com/Hienv1203/data-processor/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/Hienv1203/data-processor/discussions)
- 🤝 **Contributing**: [CONTRIBUTING.md](CONTRIBUTING.md)
- 📋 **Code of Conduct**: [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)

## Directory Structure

```
data-processor/
├── src/
│   └── data_processor/          # Main package
│       ├── __init__.py          # Package initialization
│       ├── core.py              # Core DataProcessor class
│       ├── cli.py               # CLI interface
│       ├── exceptions.py        # Custom exceptions
│       └── validators.py        # Data validators
├── tests/                       # Test suite
│       ├── __init__.py
│       ├── test_core.py         # Core tests
│       └── test_exceptions.py   # Exception tests
├── docs/                        # Documentation
│       ├── installation.md      # Installation guide
│       ├── api.md              # API reference
│       ├── cli.md              # CLI guide
│       └── examples.md         # Usage examples
├── .github/
│   └── workflows/              # GitHub Actions
│       ├── tests.yml           # Test workflow
│       ├── lint.yml            # Linting workflow
│       └── release.yml         # Release workflow
├── README.md                   # This file
├── LICENSE                     # MIT License
├── CONTRIBUTING.md             # Contributing guide
├── CODE_OF_CONDUCT.md         # Code of conduct
├── setup.py                   # Setup script
├── pyproject.toml             # Project configuration
├── requirements.txt           # Production dependencies
└── requirements-dev.txt       # Development dependencies
```

## Key Features

✅ **Multiple Formats**: CSV, JSON, Excel, Parquet
✅ **CLI Tool**: Command-line interface for quick operations
✅ **Type Safe**: Full type hints for IDE support
✅ **Well Tested**: Comprehensive test coverage
✅ **Easy to Use**: Simple and intuitive API
✅ **Extensible**: Plugin-friendly architecture

## Getting Started

1. **Install**: `pip install data-processor`
2. **Use as Library**: See [docs/api.md](docs/api.md)
3. **Use CLI**: See [docs/cli.md](docs/cli.md)
4. **See Examples**: Check [docs/examples.md](docs/examples.md)

## Development

```bash
# Clone and setup
git clone https://github.com/Hienv1203/data-processor.git
cd data-processor
pip install -e ".[dev]"

# Run tests
pytest

# Check quality
black . && flake8 . && mypy .
```

## Testing & CI/CD

- **Tests**: GitHub Actions runs on Python 3.8-3.12
- **Code Coverage**: Monitored with Codecov
- **Linting**: Automated with flake8, black, mypy
- **Release**: Automated deployment to PyPI

## Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

**Contribution areas:**
- Bug fixes and feature requests
- Documentation improvements
- Performance optimizations
- New format support
- Test coverage

## License

MIT License - see [LICENSE](LICENSE) for details

## Support

- 📝 **Documentation**: [docs/](docs/)
- 🐛 **Issues**: [GitHub Issues](https://github.com/Hienv1203/data-processor/issues)
- 💬 **Questions**: [GitHub Discussions](https://github.com/Hienv1203/data-processor/discussions)

---

**Made with ❤️ for the open-source community**
