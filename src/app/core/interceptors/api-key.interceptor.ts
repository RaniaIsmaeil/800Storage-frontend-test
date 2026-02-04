import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export const apiKeyInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith('https://reqres.in/')) {
    return next(req);
  }

  const apiKey = environment.apiKey;
  if (!apiKey) {
    return next(req);
  }

  return next(
    req.clone({
      setHeaders: {
        'x-api-key': apiKey
      }
    })
  );
};
