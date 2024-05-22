import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { RestInterceptorService } from './rest-interceptor.service';


let interceptors: any[] = [
    { provide: HTTP_INTERCEPTORS, useClass: RestInterceptorService, multi: true },
];


export const HTTP_INTERCEPTORS_LIST = interceptors;
