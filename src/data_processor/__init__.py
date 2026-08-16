"""DataProcessor - Open-source data processing library."""

__version__ = "1.0.0"
__author__ = "Data Processor Contributors"
__license__ = "MIT"

from data_processor.core import DataProcessor
from data_processor.exceptions import (
    DataProcessorError,
    FileFormatError,
    ValidationError,
)

__all__ = [
    "DataProcessor",
    "DataProcessorError",
    "FileFormatError",
    "ValidationError",
]
