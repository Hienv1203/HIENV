# Contributing to DataProcessor

Thank you for considering contributing to DataProcessor! We welcome all kinds of contributions, including bug reports, feature requests, documentation improvements, and code submissions.

## How to Contribute

### 1. **Report Bugs**

If you find a bug, please create an issue on [GitHub Issues](https://github.com/Hienv1203/data-processor/issues) with:
- Clear title describing the bug
- Detailed description of the issue
- Steps to reproduce
- Expected vs. actual behavior
- Python version and OS information
- Relevant error messages or logs

### 2. **Suggest Features**

We'd love to hear your ideas! Please:
- Check existing issues to avoid duplicates
- Open a new issue with the `enhancement` label
- Explain the use case and expected behavior
- Provide examples if possible

### 3. **Submit Code**

#### Setup Development Environment

```bash
# Clone repository
git clone https://github.com/Hienv1203/data-processor.git
cd data-processor

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install development dependencies
pip install -e ".[dev]"
```

#### Make Your Changes

1. **Create a feature branch**: `git checkout -b feature/your-feature-name`
2. **Write your code** following our style guide (see below)
3. **Add tests** for new functionality
4. **Update documentation** if needed
5. **Run tests locally**: `pytest`
6. **Check code quality**: `black . && flake8 . && mypy .`

#### Code Style Guide

- **Formatting**: Use `black` for code formatting
- **Imports**: Use `isort` for import sorting
- **Linting**: Follow `flake8` rules
- **Type Hints**: Use type hints for better code quality
- **Docstrings**: Write clear docstrings for all modules, classes, and functions
- **Line Length**: Maximum 100 characters

Example:

```python
def load_data(filepath: str, format: str = "csv") -> pd.DataFrame:
    """
    Load data from a file.
    
    Args:
        filepath: Path to the data file
        format: File format (csv, json, excel)
    
    Returns:
        DataFrame containing the loaded data
    
    Raises:
        FileNotFoundError: If file doesn't exist
        ValueError: If format is not supported
    """
    # Your implementation here
    pass
```

### 4. **Documentation**

Documentation contributions are highly valued:
- Fix typos and improve clarity
- Add examples and tutorials
- Improve API documentation
- Submit translations

## Pull Request Process

1. **Fork the repository** and create your branch
2. **Commit your changes** with clear messages
3. **Push to your fork** and open a Pull Request
4. **Fill in the PR template** with details about your changes
5. **Link related issues** using `Closes #123`
6. **Wait for review** - maintainers will provide feedback

### PR Guidelines

- Keep PRs focused and reasonably sized
- One feature/fix per PR when possible
- Write clear commit messages
- Update tests and documentation
- Ensure CI/CD checks pass
- Respond to feedback promptly

## Code Review

All submissions require review. We're looking for:
- ✅ Code quality and style compliance
- ✅ Test coverage
- ✅ Documentation
- ✅ Performance considerations
- ✅ Backward compatibility

## Development Workflow

```bash
# Before submitting:

# Format code
black .
isort .

# Run tests
pytest

# Check types
mypy .

# Check linting
flake8 .
```

## Community Guidelines

- Be respectful and inclusive
- Follow our [Code of Conduct](CODE_OF_CONDUCT.md)
- Ask questions if unsure
- Help others in the community
- Give credit where it's due

## Getting Help

- **Documentation**: Check [docs/](docs/)
- **Issues**: Search existing issues
- **Discussions**: Join [GitHub Discussions](https://github.com/Hienv1203/data-processor/discussions)
- **Email**: contributors@data-processor.dev

## Recognition

Contributors are recognized in:
- [CONTRIBUTORS.md](CONTRIBUTORS.md)
- GitHub contributors page
- Release notes

## License

By contributing to DataProcessor, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for helping make DataProcessor better!** 🚀
