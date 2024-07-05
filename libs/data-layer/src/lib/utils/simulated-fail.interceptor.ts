import { HttpEventType, HttpInterceptorFn } from '@angular/common/http';
import { tap } from 'rxjs';

export const simulatedFailInterceptor: HttpInterceptorFn = (req, next) => {
  if (Math.random() < 0.05) {
    throw Error('Interceptor failed this request');
  }

  return next(req).pipe(
    tap((event) => {
      if (Math.random() < 0.05) {
        throw Error('Interceptor failed this request in tap');
      }
      if (event.type === HttpEventType.Response) {
        console.log(req.url, 'returned a response with status', event.status);
      }
    }),
  );
};
