"""Core data processing functionality."""

from pathlib import Path
from typing import Any, Callable, Dict, List, Optional, Union

import pandas as pd

from data_processor.exceptions import FileFormatError, ValidationError


class DataProcessor:
    """Main class for data processing operations."""

    SUPPORTED_FORMATS = {".csv", ".json", ".xlsx", ".xls", ".parquet"}

    def __init__(self, verbose: bool = False):
        """
        Initialize DataProcessor.

        Args:
            verbose: Enable verbose logging
        """
        self.verbose = verbose
        self._data: Optional[pd.DataFrame] = None

    def load(
        self,
        filepath: str,
        format: Optional[str] = None,
        **kwargs: Any,
    ) -> pd.DataFrame:
        """
        Load data from file.

        Args:
            filepath: Path to the data file
            format: File format (auto-detected if not provided)
            **kwargs: Additional arguments passed to pandas reader

        Returns:
            Loaded DataFrame

        Raises:
            FileFormatError: If format is not supported
            FileNotFoundError: If file doesn't exist
        """
        path = Path(filepath)

        if not path.exists():
            raise FileNotFoundError(f"File not found: {filepath}")

        # Auto-detect format if not provided
        if format is None:
            format = path.suffix.lower()
        else:
            format = f".{format.lstrip('.')}"

        if format not in self.SUPPORTED_FORMATS:
            raise FileFormatError(
                f"Unsupported format: {format}. " f"Supported formats: {self.SUPPORTED_FORMATS}"
            )

        if self.verbose:
            print(f"Loading {format} file: {filepath}")

        if format == ".csv":
            self._data = pd.read_csv(filepath, **kwargs)
        elif format == ".json":
            self._data = pd.read_json(filepath, **kwargs)
        elif format in {".xlsx", ".xls"}:
            self._data = pd.read_excel(filepath, **kwargs)
        elif format == ".parquet":
            self._data = pd.read_parquet(filepath, **kwargs)

        if self.verbose and self._data is not None:
            print(f"Loaded {len(self._data)} rows, " f"{len(self._data.columns)} columns")

        return self._data if self._data is not None else pd.DataFrame()

    def save(
        self,
        data: pd.DataFrame,
        filepath: str,
        format: Optional[str] = None,
        **kwargs: Any,
    ) -> None:
        """
        Save data to file.

        Args:
            data: DataFrame to save
            filepath: Output file path
            format: File format (auto-detected if not provided)
            **kwargs: Additional arguments passed to pandas writer
        """
        path = Path(filepath)

        if format is None:
            format = path.suffix.lower()
        else:
            format = f".{format.lstrip('.')}"

        if format not in self.SUPPORTED_FORMATS:
            raise FileFormatError(f"Unsupported format: {format}")

        if self.verbose:
            print(f"Saving to {format}: {filepath}")

        path.parent.mkdir(parents=True, exist_ok=True)

        if format == ".csv":
            data.to_csv(filepath, index=False, **kwargs)
        elif format == ".json":
            data.to_json(filepath, orient="records", **kwargs)
        elif format in {".xlsx", ".xls"}:
            data.to_excel(filepath, index=False, **kwargs)
        elif format == ".parquet":
            data.to_parquet(filepath, index=False, **kwargs)

        if self.verbose:
            print(f"Saved successfully to {filepath}")

    def filter(
        self,
        data: pd.DataFrame,
        conditions: Dict[str, Union[Any, Callable[[Any], bool]]],
    ) -> pd.DataFrame:
        """
        Filter data based on conditions.

        Args:
            data: DataFrame to filter
            conditions: Dictionary of column:condition pairs

        Returns:
            Filtered DataFrame
        """
        result = data.copy()

        for column, condition in conditions.items():
            if column not in result.columns:
                raise ValidationError(f"Column not found: {column}")

            if callable(condition):
                result = result[result[column].apply(condition)]
            else:
                result = result[result[column] == condition]

        if self.verbose:
            print(f"Filtered from {len(data)} to {len(result)} rows")

        return result

    def aggregate(
        self,
        data: pd.DataFrame,
        group_by: Union[str, List[str]],
        agg_func: Optional[Dict[str, Union[str, Callable[[Any], Any]]]] = None,
    ) -> Union[pd.DataFrame, pd.Series]:
        """
        Aggregate data by grouping.

        Args:
            data: DataFrame to aggregate
            group_by: Column(s) to group by
            agg_func: Aggregation functions (default: 'size' for count)

        Returns:
            Aggregated DataFrame
        """
        if agg_func is None or len(agg_func) == 0:
            # Default: count the number of records per group
            result = data.groupby(group_by).size()
        else:
            result = data.groupby(group_by).agg(agg_func)

        if self.verbose:
            print(f"Aggregated to {len(result)} groups")

        return result

    def validate_schema(
        self,
        data: pd.DataFrame,
        schema: Dict[str, str],
    ) -> bool:
        """
        Validate data against schema.

        Args:
            data: DataFrame to validate
            schema: Dictionary of column:type pairs

        Returns:
            True if valid
        """
        for column, dtype in schema.items():
            if column not in data.columns:
                raise ValidationError(f"Missing column: {column}")

        if self.verbose:
            print("Schema validation passed")

        return True

    def get_stats(self, data: pd.DataFrame) -> Dict[str, Any]:
        """
        Get statistical summary of data.

        Args:
            data: DataFrame to analyze

        Returns:
            Dictionary with statistics
        """
        return {
            "rows": len(data),
            "columns": len(data.columns),
            "memory_usage": data.memory_usage(deep=True).sum() / 1024**2,  # MB
            "dtypes": data.dtypes.to_dict(),
            "missing_values": data.isnull().sum().to_dict(),
        }
