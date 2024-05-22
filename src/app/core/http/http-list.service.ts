import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ParamsEncoderService } from './params-encoder.service';
import { CollectionQueryParams } from '../types/collection-query-params';

@Injectable({
    providedIn: 'root',
})
export class HttpListService {
    private pageParam = 'page';
    private skipParam = 'skip';
    private takeParam = 'take';
    private sortParam = 'sorter';
    private filterParam = 'filter';

    constructor(
        private http: HttpClient,
        private paramsEncoder: ParamsEncoderService
    ) { }

    /**
     * Realiza una petición GET
     */
    get<T>(
        url: string,
        queryParams: CollectionQueryParams = {
            skip: 0,
            take: 10,
        },
        options?: any
    ): Observable<T> {
        const me = this;
        const params = [];
        // Incluye el parámetro de página si está definido
        if (queryParams.page !== undefined) {
            params.push(`${me.pageParam}=${queryParams.page}`);
        }
        if (queryParams.skip !== undefined) {
            params.push(`${me.skipParam}=${queryParams.skip}`);
        }
        if (queryParams.take) {
            params.push(`${me.takeParam}=${queryParams.take}`);
        }
        if (queryParams.sorter) {
            params.push(
                `${me.sortParam}=${encodeURI(me.paramsEncoder.encodeSorters(queryParams.sorter))}`
            );
        }
        if (queryParams.filter) {
            params.push(
                `${me.filterParam}=${encodeURI(me.paramsEncoder.encodeFilters(queryParams.filter))}`
            );
        }
        // Other params
        if (queryParams.otherParams) {
            Object.keys(queryParams.otherParams).forEach((key) => {
                params.push(`${key}=${queryParams.otherParams![key]}`);
            });
        }
        url = me.urlAppend(url, params.join('&'));
        return me.http.get(url, options) as unknown as Observable<T>;
    }

    private urlAppend(url: string, str: string): string {
        if (str) {
            return url + (url.indexOf('?') === -1 ? '?' : '&') + str;
        }
        return url;
    }

    private getParams(date: Date): HttpParams {
        return new HttpParams().set('_dc', date.getTime().toString());
    }
}
