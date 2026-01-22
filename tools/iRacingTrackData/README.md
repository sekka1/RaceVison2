# iRacing Track Data Tools

This directory contains tools for downloading and processing track data from the iRacing API.

## Authentication Testing

The authentication module includes comprehensive unit tests to ensure the authentication logic works correctly before deploying changes.

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Coverage

The test suite covers:

1. **IRacingAuthClient** (`services/__tests__/iracingAuthClient.test.ts`)
   - Constructor and password encryption
   - Token generation with valid credentials
   - Error handling for various HTTP status codes (405, 401, 500)
   - Missing or invalid response headers
   - Network errors
   - Password hashing consistency

2. **authenticate function** (`__tests__/authenticate.test.ts`)
   - Successful authentication flow
   - Missing or empty environment variables
   - Error propagation from IRacingAuthClient
   - Network error handling

### Authentication Flow

1. Environment variables `IRACING_USERNAME` and `IRACING_PASSWORD` must be set
2. The password is encrypted using SHA-256 with the username as salt
3. A POST request is sent to the iRacing auth endpoint
4. Authentication cookies are extracted from the response headers
5. The cookies are used for subsequent API requests

### Common Errors

- **405 Not Allowed**: The iRacing API endpoint may have changed or the request format is incorrect
- **401 Unauthorized**: Invalid credentials
- **Missing Response Header**: The response doesn't include the expected Set-Cookie headers
- **Base URL not defined**: The `IRACING_BASE_URL` environment variable is not set

### CI/CD Integration

Tests are automatically run in the PR build workflow to ensure authentication logic is working before merging changes.

## Development

When making changes to the authentication logic:

1. Update the relevant source files
2. Run the tests to ensure nothing breaks
3. Add new test cases if adding new functionality
4. Run linting: `npm run lint`
5. Commit your changes

The PR build will automatically run tests to verify your changes.
