import { Observable, Subscription, throwError } from 'rxjs';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, finalize } from 'rxjs/operators';
import { SpinnerOverlayService } from '../services/spinner/spinner-animation.service';

@Injectable({
    providedIn: 'root'
})
export class RestInterceptorService implements HttpInterceptor {
    constructor(
        private spinnerOverlayService: SpinnerOverlayService
    ) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        //let route = req.url.split('/')
        const spinnerSubscription: Subscription = this.spinnerOverlayService.spinner$.subscribe();
        return next.handle(req).pipe(
            finalize(() => spinnerSubscription.unsubscribe()),
            catchError((err: HttpErrorResponse) => {
                return throwError(() => err);
            })
        )
    }
}