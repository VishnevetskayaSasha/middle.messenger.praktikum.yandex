import { HTTPTransport } from '../framework';

export abstract class BaseAPI {
  protected http = new HTTPTransport();
}
