"""Tests for data_processor.exceptions module."""

import pytest

from data_processor.exceptions import (
    DataProcessorError,
    FileFormatError,
    FilterError,
    ValidationError,
)


class TestExceptions:
    """Test suite for custom exceptions."""

    def test_base_exception(self):
        """Test base exception."""
        with pytest.raises(DataProcessorError):
            raise DataProcessorError("Test error")

    def test_file_format_error(self):
        """Test FileFormatError."""
        with pytest.raises(FileFormatError):
            raise FileFormatError("Unsupported format")

    def test_validation_error(self):
        """Test ValidationError."""
        with pytest.raises(ValidationError):
            raise ValidationError("Validation failed")

    def test_filter_error(self):
        """Test FilterError."""
        with pytest.raises(FilterError):
            raise FilterError("Filter failed")

    def test_exception_inheritance(self):
        """Test exception inheritance chain."""
        exc = FileFormatError("Test")
        assert isinstance(exc, DataProcessorError)
        assert isinstance(exc, Exception)
