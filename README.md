English | [日本語](README.ja.md)

# seismic-response-web

This is a seismic response analysis tool for structural systems of mass points.

English UI may be added in the future. The schedule for this is undecided.

## Usage

### Loading Sample Data

Upon opening the site, sample data and parameters are already loaded. Clicking the "Load Sample Data" button will reload them.

### Uploading Files

Users can also upload their earthquake data as a CSV file. Click the "Upload File" button and select the target CSV file.

This CSV file should contain data of earthquake acceleration waveforms in each column.

Values that cannot be parsed as numbers will be ignored. Thus, it is okay for non-numeric values to be included in headers, for example.

### Downloading Calculation Results

Calculation results can be downloaded as a CSV file using the "Download CSV of Displayed Range" button. Time [ms] is recorded in the first column, and absolute response acceleration [gal] is recorded in subsequent columns.

## About the Calculation Method

This tool is created based on the following library. For details, please refer to the link below.

[seismic-response-rs](https://github.com/azishio/seismic-response-rs)

## License

Licensed under one of the following:

+ Apache License, Version 2.0, ([LICENSE-APACHE](http://www.apache.org/licenses/LICENSE-2.0))
+ MIT License ([LICENSE-MIT](http://opensource.org/licenses/MIT))

(The English in the README file has been translated by DeepL and ChatGPT.)
