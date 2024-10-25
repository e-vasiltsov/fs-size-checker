# fs-size-checker

A powerful CLI tool for analyzing file and directory sizes. Signals errors via standard exit codes when specified size limits are exceeded, providing precise file system size management and seamless CI/CD integration.

## Features

- [x] Check sizes of files and directories
- [x] Set size limits and get warnings when exceeded
- [x] Configurable via command-line arguments
- [x] Cross-platform path handling (works on Windows, macOS, and Linux)
- [ ] Configurable via a configuration file
- [x] Use regex patterns to match specific files
- [x] Colorized output for better readability
- [ ] Support for multiple units of measurement (B, KB, MB, GB, TB)

Legend:
- [x] Implemented feature
- [ ] Planned feature

## Key Characteristics

- **Zero Dependencies**: This project is built without any external runtime dependencies, ensuring a lightweight and secure installation.
- **Object-Oriented Programming (OOP) Approach**: Utilizes OOP principles for better code organization, maintainability, and extensibility.
- **TypeScript**: Written in TypeScript for enhanced type safety and better developer experience.
- **SOLID Principles**: Adheres to SOLID principles of object-oriented design, promoting clean and maintainable code.
- **Extensible Architecture**: Designed with extensibility in mind, making it easy to add new features or modify existing ones.
- **Cross-platform Compatibility**: Works on Windows, macOS, and Linux operating systems.
- **Comprehensive Test Suite**: Includes a robust set of unit and integration tests to ensure reliability.
- **Well-documented**: Provides clear and comprehensive documentation for easy understanding and usage.

## Security

- No execution of external code or scripts
- Strict input validation to prevent potential vulnerabilities
- Read-only operations ensure no modifications to your file system

## Installation

You can install fs-size-checker globally using npm:

```bash
npm install -g fs-size-checker
```

Or, if you prefer to use it as a development dependency in your project:
```bash
npm install --save-dev fs-size-checker
```

## Usage

### Basic Usage

You can run fs-size-checker directly from the command line after installing it globally:

```bash
fs-size-checker <path> <max_size> <unit>
```

For example:

```bash
fs-size-checker ./dist 50000 B
```

This command checks if the ./dist directory exceeds 50000 B.

### Using as an npm script

You can also add `fs-size-checker` as a script in your `package.json` file. This is useful for projects where you want to check file sizes as part of your development or build process.

Add one of the following scripts to your `package.json`:

Examples:

1. Using a specific directory and size limit in bytes:

```json
{
  "scripts": {
    "check-size": "fs-size-checker --path ./dist --max-size 50000 --unit B"
  }
}
```

2. Checking a specific file with a size limit in bytes:

```json
{
  "scripts": {
    "check-size": "fs-size-checker --path ./dist/index.js --max-size 1000 --unit B"
  }
}
```

3. Checking by specific paterns with a size limit in bytes:

3.1 Check all JavaScript files in the 'dist' directory:

```json
{
  "scripts": {
    "check-size": "fs-size-checker --path 'dist/*.js' --max-size 500 --unit KB"
  }
}
```

3.2 Check all TypeScript files in the 'dist' directory and its subdirectories:

```json
{
  "scripts": {
    "check-size": "fs-size-checker --path 'dist/**/*.ts' --max-size 500 --unit KB"
  }
}
```

3.3 Check all JPEG and PNG images in the 'dist' directory and its subdirectories:

```json
{
  "scripts": {
    "check-size": "fs-size-checker --path 'dist/**/*.(jpeg|png)' --max-size 500 --unit KB"
  }
}
```

4. You can also use positional arguments:

```json
{
  "scripts": {
    "check-size": "fs-size-checker ./dist 1000 B"
  }
}
```

Run it with:

```bash
npm run check-size
```

#### Options

- `--path` or `-p`: The path to check. Can include directory and file matching patterns. Can be specified multiple times for checking multiple paths.
- `--max-size` or `-m`: The maximum allowed size (a positive number). Can be specified multiple times, corresponding to each path.
- `--unit` or `-u`: The unit for the size ( B ). If not specified, defaults to B (bytes). Can be specified multiple times, corresponding to each path.
- `--help` or `-h`: Display the help message.

#### Cross-Platform Path Support

fs-size-checker supports cross-platform paths, so you can use it on Windows, macOS, and Linux without worrying about path separators:

```bash
# On Windows
fs-size-checker --path C:\Users\YourName\Documents --max-size 10000 --unit B

# On macOS or Linux
fs-size-checker --path /home/yourname/documents --max-size 10000 --unit B
```

Both of these commands will work correctly on their respective platforms.

## Exit Codes and Error Handling

fs-size-checker uses exit codes to communicate the result of the size check:

- Exit code 0: All checked paths are within their specified size limits.
- Exit code 1: One or more checked paths exceed their specified size limits, or an error occurred during execution.

When a size limit is exceeded, fs-size-checker will:

1. Print a warning message to the console for each path that exceeds its limit.
2. Continue checking all specified paths.
3. Exit with code 1 after all checks are complete, if any limits were exceeded.

This approach ensures that:
- All specified paths are checked, even if earlier ones exceed their limits.
- The tool provides immediate feedback for each exceeded limit.
- Scripts or CI/CD pipelines can easily detect when any limit has been exceeded.

## Development

To set up the project for development:

1. Clone the repository
2. Install dependencies: `npm install`
3. Build the project: `npm run build`
4. Run tests: `npm test`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file in the project root for the full license text.

The MIT License is a permissive license that allows for reuse with few restrictions. It permits use, modification, distribution, sublicense, and private use, provided that the license and copyright notice are included in all copies or substantial portions of the software.
