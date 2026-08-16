"""Exception classes for DataProcessor."""


class DataProcessorError(Exception):
    """Base exception for DataProcessor."""

    pass


class FileFormatError(DataProcessorError):
    """Raised when file format is not supported."""

    pass


class ValidationError(DataProcessorError):
    """Raised when data validation fails."""

    pass


class FilterError(DataProcessorError):
    """Raised when filter operation fails."""

    pass
