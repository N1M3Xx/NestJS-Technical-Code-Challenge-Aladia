import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AUTH_SERVICE } from '../constants';
import { Observable } from 'rxjs';

@Injectable()
export class NetworkingService {
  constructor(@Inject(AUTH_SERVICE) private readonly client: ClientProxy) {}

  send<TResult = unknown, TInput = unknown>(pattern: unknown, data: TInput): Observable<TResult> {
    return this.client.send<TResult, TInput>(pattern, data);
  }

  emit<TInput = unknown>(pattern: unknown, data: TInput): Observable<unknown> {
    return this.client.emit<TInput>(pattern, data);
  }
}
