"""CLI interface for DataProcessor."""

import json
import sys
from pathlib import Path
from typing import Optional

import click

from data_processor import DataProcessor
from data_processor.exceptions import DataProcessorError


@click.group()
@click.version_option()
def main() -> None:
    """
    DataProcessor - Open-source data processing tool.

    Process CSV, JSON, Excel files with simple commands.
    """
    pass


@main.command()
@click.option("--input", "-i", required=True, help="Input file path")
@click.option("--output", "-o", required=True, help="Output file path")
@click.option("--format", "-f", help="Output format (auto-detected if omitted)")
def convert(input: str, output: str, format: Optional[str]) -> None:
    """Convert data between formats."""
    try:
        processor = DataProcessor(verbose=True)
        data = processor.load(input)
        processor.save(data, output, format=format)
        click.secho("✓ Conversion successful", fg="green")
    except DataProcessorError as e:
        click.secho(f"✗ Error: {e}", fg="red")
        sys.exit(1)


@main.command()
@click.option("--input", "-i", required=True, help="Input file path")
@click.option("--output", "-o", required=True, help="Output file path")
@click.option("--column", "-c", required=True, help="Column to group by")
@click.option("--format", "-f", default="json", help="Output format")
def aggregate(input: str, output: str, column: str, format: str) -> None:
    """Aggregate data by grouping."""
    try:
        processor = DataProcessor(verbose=True)
        data = processor.load(input)
        result = processor.aggregate(data, group_by=column, agg_func={})
        processor.save(result.reset_index(), output, format=format)
        click.secho("✓ Aggregation complete", fg="green")
    except DataProcessorError as e:
        click.secho(f"✗ Error: {e}", fg="red")
        sys.exit(1)


@main.command()
@click.option("--input", "-i", required=True, help="Input file path")
def inspect(input: str) -> None:
    """Inspect data file."""
    try:
        processor = DataProcessor()
        data = processor.load(input)
        stats = processor.get_stats(data)

        click.secho("\n📊 Data Statistics", fg="cyan", bold=True)
        click.echo(f"Rows: {stats['rows']}")
        click.echo(f"Columns: {stats['columns']}")
        click.echo(f"Memory: {stats['memory_usage']:.2f} MB")
        click.echo(f"\nColumn Types:")
        for col, dtype in stats["dtypes"].items():
            click.echo(f"  - {col}: {dtype}")

        if any(stats["missing_values"].values()):
            click.echo(f"\nMissing Values:")
            for col, count in stats["missing_values"].items():
                if count > 0:
                    click.echo(f"  - {col}: {count}")

        click.echo()
    except DataProcessorError as e:
        click.secho(f"✗ Error: {e}", fg="red")
        sys.exit(1)


@main.command()
@click.option("--input", "-i", required=True, help="Input file path")
@click.option("--column", "-c", required=True, help="Column to check")
@click.option("--value", "-v", required=True, help="Value to filter by")
@click.option("--output", "-o", required=True, help="Output file path")
def filter(input: str, column: str, value: str, output: str) -> None:
    """Filter data by column value."""
    try:
        processor = DataProcessor(verbose=True)
        data = processor.load(input)
        result = processor.filter(data, {column: value})
        processor.save(result, output)
        click.secho("✓ Filtering complete", fg="green")
    except DataProcessorError as e:
        click.secho(f"✗ Error: {e}", fg="red")
        sys.exit(1)


if __name__ == "__main__":
    main()
