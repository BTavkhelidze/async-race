import {
  isMockServerConnectionError,
  MOCK_SERVER_REPOSITORY_URL,
} from '../../lib/api-client';

type ApiErrorMessageProps = {
  error: Error;
};

function ApiErrorMessage({ error }: ApiErrorMessageProps) {
  if (!isMockServerConnectionError(error)) {
    return (
      <p role='alert' className='text-sm text-red-400'>
        {error.message}
      </p>
    );
  }

  return (
    <p role='alert' className='text-sm text-red-400'>
      Cannot connect to the Async Race mock server. Run the server locally to
      fetch data.{' '}
      <a
        href={MOCK_SERVER_REPOSITORY_URL}
        target='_blank'
        rel='noreferrer'
        className='font-semibold text-[#FFB199] underline decoration-[#FF5722]/60 underline-offset-4 transition-colors hover:text-white'
      >
        Server setup instructions
      </a>
      .
    </p>
  );
}

export default ApiErrorMessage;
