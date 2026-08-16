"""Tests for data_processor.core module."""

import tempfile
from pathlib import Path

import pandas as pd
import pytest

from data_processor import DataProcessor
from data_processor.exceptions import FileFormatError, ValidationError


@pytest.fixture
def sample_data():
    """Create sample data for testing."""
    return pd.DataFrame({
        "name": ["Alice", "Bob", "Charlie", "Diana"],
        "age": [25, 30, 35, 28],
        "city": ["NYC", "LA", "NYC", "Chicago"],
    })


@pytest.fixture
def temp_csv(sample_data):
    """Create temporary CSV file."""
    with tempfile.NamedTemporaryFile(mode="w", suffix=".csv", delete=False) as f:
        sample_data.to_csv(f.name, index=False)
        yield f.name
    Path(f.name).unlink()


class TestDataProcessor:
    """Test suite for DataProcessor class."""

    def test_load_csv(self, temp_csv):
        """Test loading CSV file."""
        processor = DataProcessor()
        data = processor.load(temp_csv)
        assert len(data) == 4
        assert list(data.columns) == ["name", "age", "city"]

    def test_load_nonexistent_file(self):
        """Test loading non-existent file."""
        processor = DataProcessor()
        with pytest.raises(FileNotFoundError):
            processor.load("nonexistent.csv")

    def test_load_unsupported_format(self, temp_csv):
        """Test loading unsupported format."""
        processor = DataProcessor()
        with pytest.raises(FileFormatError):
            processor.load(temp_csv, format="unsupported")

    def test_save_csv(self, sample_data):
        """Test saving to CSV."""
        processor = DataProcessor()
        with tempfile.NamedTemporaryFile(suffix=".csv", delete=False) as f:
            output_path = f.name

        try:
            processor.save(sample_data, output_path)
            loaded = pd.read_csv(output_path)
            assert len(loaded) == len(sample_data)
        finally:
            Path(output_path).unlink()

    def test_save_json(self, sample_data):
        """Test saving to JSON."""
        processor = DataProcessor()
        with tempfile.NamedTemporaryFile(suffix=".json", delete=False) as f:
            output_path = f.name

        try:
            processor.save(sample_data, output_path)
            assert Path(output_path).exists()
        finally:
            Path(output_path).unlink()

    def test_filter_equality(self, sample_data):
        """Test filter with equality condition."""
        processor = DataProcessor()
        result = processor.filter(sample_data, {"city": "NYC"})
        assert len(result) == 2
        assert all(result["city"] == "NYC")

    def test_filter_callable(self, sample_data):
        """Test filter with callable condition."""
        processor = DataProcessor()
        result = processor.filter(sample_data, {"age": lambda x: x > 28})
        assert len(result) == 2

    def test_filter_invalid_column(self, sample_data):
        """Test filter with invalid column."""
        processor = DataProcessor()
        with pytest.raises(ValidationError):
            processor.filter(sample_data, {"invalid_col": "value"})

    def test_aggregate(self, sample_data):
        """Test aggregation."""
        processor = DataProcessor()
        result = processor.aggregate(sample_data, group_by="city")
        assert len(result) == 3  # NYC, LA, Chicago

    def test_get_stats(self, sample_data):
        """Test getting statistics."""
        processor = DataProcessor()
        stats = processor.get_stats(sample_data)

        assert stats["rows"] == 4
        assert stats["columns"] == 3
        assert "dtypes" in stats
        assert "missing_values" in stats
