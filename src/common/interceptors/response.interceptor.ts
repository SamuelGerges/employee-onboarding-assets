import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import  { ApiResponse } from "../interfaces/api-response.interface";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { RESPONSE_MESSAGE_KEY } from "../decorators/response-message.decorator";
import { Reflector } from "@nestjs/core";

@Injectable()

export class ResponseInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {

  constructor(private reflector: Reflector) {}


  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
    const customMessage = this.reflector.get<string>(RESPONSE_MESSAGE_KEY, context.getHandler());
    return next.handle().pipe(
      map((data) => ({
        success: true,
        statusCode: context.switchToHttp().getResponse().statusCode,
        message: customMessage || 'Request successful',
        data: data || null,
        timestamp: new Date().toISOString(),
      })),
    );
  }
}