import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import HTTPTransport from './HTTPTransport';

describe('HTTPTransport', () => {
  let http: HTTPTransport;
  let openMock: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    http = new HTTPTransport();
    openMock = vi.spyOn(XMLHttpRequest.prototype, 'open');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('должен отправлять GET-запрос', async () => {
    const sendMock = vi.spyOn(XMLHttpRequest.prototype, 'send');

    const request = http.get('/test');
    const xhr = openMock.mock.instances[0] as XMLHttpRequest;

    Object.defineProperty(xhr, 'status', {
      value: 200,
    });

    xhr.onload?.(new ProgressEvent('load'));
    await request;

    expect(openMock).toHaveBeenCalledWith('GET', '/test');
    expect(sendMock).toHaveBeenCalled();
  });

  it('должен добавлять данные в query string для GET-запроса', async () => {
    const request = http.get('/users', {
      data: {
        page: 2,
        search: 'Alex',
      },
    });
    const xhr = openMock.mock.instances[0] as XMLHttpRequest;

    Object.defineProperty(xhr, 'status', {
      value: 200,
    });

    xhr.onload?.(new ProgressEvent('load'));
    await request;

    expect(openMock).toHaveBeenCalledWith(
      'GET',
      '/users?page=2&search=Alex',
    );
  });

  it('должен отправлять данные в body POST-запроса', async () => {
    const sendMock = vi.spyOn(XMLHttpRequest.prototype, 'send');

    const data = {
      login: 'Alex',
      password: '123456',
    };

    const request = http.post('/login', { data });
    const xhr = openMock.mock.instances[0] as XMLHttpRequest;

    Object.defineProperty(xhr, 'status', {
      value: 200,
    });

    xhr.onload?.(new ProgressEvent('load'));
    await request;

    expect(openMock).toHaveBeenCalledWith('POST', '/login');
    expect(sendMock).toHaveBeenCalledWith(JSON.stringify(data));
  });

  it('должен отклонять Promise при HTTP-ошибке', async () => {
    const request = http.get('/test');
    const xhr = openMock.mock.instances[0] as XMLHttpRequest;

    Object.defineProperty(xhr, 'status', {
      value: 500,
    });

    Object.defineProperty(xhr, 'statusText', {
      value: 'Internal Server Error',
    });

    xhr.onload?.(new ProgressEvent('load'));
    await expect(request).rejects.toThrow();
  });

  it('должен отклонять Promise при ошибке сети', async () => {
    const request = http.get('/test');
    const xhr = openMock.mock.instances[0] as XMLHttpRequest;

    xhr.onerror?.(new ProgressEvent('error'));
    await expect(request).rejects.toThrow('Network request failed');
  });

  it('должен устанавливать Content-Type для JSON-данных', async () => {
    const setRequestHeaderMock = vi.spyOn(XMLHttpRequest.prototype, 'setRequestHeader');

    const request = http.post('/login', {
      data: {
        login: 'Alex',
      },
    });
    const xhr = openMock.mock.instances[0] as XMLHttpRequest;

    Object.defineProperty(xhr, 'status', {
      value: 200,
    });

    xhr.onload?.(new ProgressEvent('load'));
    await request;

    expect(setRequestHeaderMock).toHaveBeenCalledWith(
      'Content-Type',
      'application/json',
    );
  });

  it('должен преобразовывать JSON-ответ в объект', async () => {
    const getResponseHeaderMock = vi.spyOn(
      XMLHttpRequest.prototype,
      'getResponseHeader',
    );
    getResponseHeaderMock.mockReturnValue('application/json');

    const request = http.get<{ success: boolean }>('/test');
    const xhr = openMock.mock.instances[0] as XMLHttpRequest;

    Object.defineProperty(xhr, 'status', {
      value: 200,
    });

    Object.defineProperty(xhr, 'responseText', {
      value: '{"success":true}',
    });

    xhr.onload?.(new ProgressEvent('load'));
    await expect(request).resolves.toEqual({
      success: true,
    });
  });
});
