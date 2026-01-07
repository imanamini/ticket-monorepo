import { HttpHeaders, HttpParams } from '@angular/common/http';
import { RequestMethodType } from '../models/Request-method.type';
import { RequestTypeEnum } from '../models/request-type.enum';
import { HttpOptionInterface } from '../models/http-option.interface';

export class RequestBuilder {
  public method: RequestMethodType = 'GET';
  private params: HttpParams = new HttpParams();
  private headers: HttpHeaders = new HttpHeaders();
  private options: { [key: string]: any } = {};
  private requestTypeConfig: Record<RequestTypeEnum, any> = {
    [RequestTypeEnum.GET]: { method: 'GET' },
    [RequestTypeEnum.POST]: { method: 'POST' },
    [RequestTypeEnum.PUT]: { method: 'PUT' },
    [RequestTypeEnum.PATCH]: { method: 'PATCH' },
    [RequestTypeEnum.DELETE]: { method: 'DELETE' },
    [RequestTypeEnum.GET_TEXT]: {
      method: 'GET',
      options: { responseType: 'text' },
    },
    [RequestTypeEnum.GET_PAGE]: {
      method: 'GET',
      headers: { Accept: 'text/html,application/xhtml+xml;' },
      options: { responseType: 'text' },
    },
    [RequestTypeEnum.GET_IMAGE]: {
      method: 'GET',
      options: { responseType: 'blob' },
    },
    [RequestTypeEnum.GET_IMAGE_BY_POST_REQUEST]: {
      method: 'POST',
      options: { responseType: 'blob' },
    },
  };

  constructor(
    public type: RequestTypeEnum,
    public endpoint: string,
    public body: HttpOptionInterface = {},
    public forceSend = false,
  ) {
    this.setConfig();
  }

  public setParams(params: HttpOptionInterface): RequestBuilder {
    let httpParams: HttpParams = new HttpParams();
    Object.keys(params).forEach(function (key) {
      httpParams = httpParams.append(key, params[key]);
    });
    this.params = httpParams;
    return this;
  }

  public getParams(): HttpParams {
    return this.params;
  }

  public setHeader(params: HttpOptionInterface): RequestBuilder {
    Object.keys(params).forEach((key) => {
      this.headers = this.headers.append(key, params[key]);
    });
    return this;
  }

  public getHeader(): HttpHeaders {
    return this.headers;
  }

  public patchOptions(options: { [key: string]: any }): RequestBuilder {
    this.options = {
      ...this.options,
      ...options,
    };
    return this;
  }

  public getOptions(): { [key: string]: any } {
    return this.options;
  }

  public enableCache(ttl: number): RequestBuilder {
    const cacheHeaders = { 'enable-cache': 'enable', 'cache-ttl': ttl.toString() };
    return this.setHeader(cacheHeaders);
  }

  private setConfig(): void {
    const requestType = this.requestTypeConfig[this.type];
    if (requestType) {
      this.method = requestType.method;
      if (requestType.headers) {
        this.setHeader(requestType.headers);
      }
      if (requestType.options) {
        this.patchOptions(requestType.options);
      }
    }
    this.setHeader({ 'ngsw-bypass': 'true' });
  }
}
