import type { HTTPError } from '../framework';

export function getApiErrorReason(error: HTTPError): string | null {
  const response = error.response;

  if (
    typeof response !== 'object' ||
    response === null ||
    !('reason' in response) ||
    typeof response.reason !== 'string'
  ) {
    return null;
  }

  return response.reason;
}
