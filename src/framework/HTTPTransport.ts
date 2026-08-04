const METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
} as const;

type Method = typeof METHODS[keyof typeof METHODS];

type RequestData = object;

type ResponseType = XMLHttpRequestResponseType;

interface RequestOptions {
  data?: RequestData | FormData;
  headers?: Record<string, string>;
  timeout?: number;
  responseType?: ResponseType;
}

interface RequestOptionsWithMethod extends RequestOptions {
  method: Method;
}

export class HTTPError extends Error {
  public status: number;
  public statusText: string;
  public response: unknown;
  public request: XMLHttpRequest;

  constructor(
    status: number,
    statusText: string,
    response: unknown,
    request: XMLHttpRequest,
  ) {
    super(`HTTP error ${status}: ${statusText}`);

    this.name = 'HTTPError';
    this.status = status;
    this.statusText = statusText;
    this.response = response;
    this.request = request;
  }
}

function queryStringify(data: object): string {
  if (data === null || Array.isArray(data)) {
    throw new Error('Data must be a non-null object');
  }

  const query = Object.entries(data)
    .filter(([, value]) => value !== undefined && value !== null)
    .map(([key, value]) => {
      const encodedKey = encodeURIComponent(key);
      const encodedValue = encodeURIComponent(String(value));

      return `${encodedKey}=${encodedValue}`;
    })
    .join('&');

  return query ? `?${query}` : '';
}

export default class HTTPTransport {
  public get = <TResponse = unknown>(
    url: string,
    options: RequestOptions = {},
  ): Promise<TResponse> => {
    return this.request<TResponse>(
      url,
      {
        ...options,
        method: METHODS.GET,
      },
      options.timeout,
    );
  };

  public post = <TResponse = unknown>(
    url: string,
    options: RequestOptions = {},
  ): Promise<TResponse> => {
    return this.request<TResponse>(
      url,
      {
        ...options,
        method: METHODS.POST,
      },
      options.timeout,
    );
  };

  public put = <TResponse = unknown>(
    url: string,
    options: RequestOptions = {},
  ): Promise<TResponse> => {
    return this.request<TResponse>(
      url,
      {
        ...options,
        method: METHODS.PUT,
      },
      options.timeout,
    );
  };

  public delete = <TResponse = unknown>(
    url: string,
    options: RequestOptions = {},
  ): Promise<TResponse> => {
    return this.request<TResponse>(
      url,
      {
        ...options,
        method: METHODS.DELETE,
      },
      options.timeout,
    );
  };

  private request = <TResponse>(
    url: string,
    options: RequestOptionsWithMethod,
    timeout = 5000,
  ): Promise<TResponse> => {
    const {
      headers = {},
      method,
      data,
      responseType,
    } = options;

    return new Promise<TResponse>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const isGet = method === METHODS.GET;

      const requestUrl =
        isGet && data && !(data instanceof FormData)
          ? `${url}${queryStringify(data)}`
          : url;

      xhr.open(method, requestUrl);

      xhr.timeout = timeout;
      xhr.withCredentials = true;

      if (responseType) {
        xhr.responseType = responseType;
      }

      Object.entries(headers).forEach(([key, value]) => {
        xhr.setRequestHeader(key, value);
      });

      xhr.onload = () => {
        const response = this.parseResponse(xhr);

        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(response as TResponse);
          return;
        }

        reject(
          new HTTPError(
            xhr.status,
            xhr.statusText,
            response,
            xhr,
          ),
        );
      };

      xhr.onabort = () => {
        reject(new Error('Request was aborted'));
      };

      xhr.onerror = () => {
        reject(new Error('Network request failed'));
      };

      xhr.ontimeout = () => {
        reject(
          new Error(`Request timed out after ${timeout} ms`),
        );
      };

      if (isGet || data === undefined) {
        xhr.send();
        return;
      }

      if (data instanceof FormData) {
        xhr.send(data);
        return;
      }

      const hasContentType = Object.keys(headers).some(
        (header) => header.toLowerCase() === 'content-type',
      );

      if (!hasContentType) {
        xhr.setRequestHeader(
          'Content-Type',
          'application/json',
        );
      }

      xhr.send(JSON.stringify(data));
    });
  };

  private parseResponse(xhr: XMLHttpRequest): unknown {
    if (xhr.responseType && xhr.responseType !== 'text') {
      return xhr.response;
    }

    const contentType = xhr.getResponseHeader('Content-Type');

    if (contentType?.includes('application/json')) {
      try {
        return JSON.parse(xhr.responseText) as unknown;
      } catch {
        return xhr.responseText;
      }
    }

    return xhr.responseText;
  }
}
