#!/usr/bin/env python3
"""Setup script for data-processor package."""

from setuptools import setup, find_packages

setup(
    name="data-processor",
    version="1.0.0",
    author="Data Processor Contributors",
    author_email="contributors@data-processor.dev",
    description="Fast, flexible, and developer-friendly Python library for processing structured data",
    long_description=open("README.md").read(),
    long_description_content_type="text/markdown",
    url="https://github.com/Hienv1203/data-processor",
    packages=find_packages(where="src"),
    package_dir={"": "src"},
    python_requires=">=3.8",
    install_requires=[
        "pandas>=1.3.0",
        "openpyxl>=3.0.0",
        "click>=8.0.0",
        "pydantic>=2.0.0",
    ],
    extras_require={
        "dev": [
            "pytest>=7.0",
            "pytest-cov>=3.0",
            "black>=22.0",
            "flake8>=4.0",
            "mypy>=0.970",
            "isort>=5.0",
        ],
    },
    entry_points={
        "console_scripts": [
            "data-processor=data_processor.cli:main",
        ],
    },
    classifiers=[
        "Development Status :: 4 - Beta",
        "Intended Audience :: Developers",
        "License :: OSI Approved :: MIT License",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
        "Programming Language :: Python :: 3.11",
        "Programming Language :: Python :: 3.12",
    ],
)
