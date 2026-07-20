export const API_BASE_URL = String(import.meta.env.VITE_API_BASE_URL);

export const MOCK_SERVER_REPOSITORY_URL =
  'https://github.com/mikhama/async-race-api';

export class MockServerConnectionError extends Error {
  constructor() {
    super(
      `Cannot connect to the Async Race mock server at ${API_BASE_URL}. Run the server locally to fetch data. Setup instructions: ${MOCK_SERVER_REPOSITORY_URL}`,
    );
    this.name = 'MockServerConnectionError';
  }
}

export const isMockServerConnectionError = (
  error: unknown,
): error is MockServerConnectionError =>
  error instanceof MockServerConnectionError ||
  (error instanceof Error && error.name === 'MockServerConnectionError');

const isFetchNetworkError = (error: unknown): error is TypeError =>
  error instanceof TypeError && error.message.toLowerCase().includes('fetch');

export const apiFetch = async (
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> => {
  try {
    return await fetch(input, init);
  } catch (error) {
    if (isFetchNetworkError(error)) {
      throw new MockServerConnectionError();
    }

    throw error;
  }
};
