import { Injectable } from '@angular/core';
import { CollectionSorter } from '../types/collection-sorter';
import { CollectionFilter } from '../types/collection-filter';

@Injectable({
    providedIn: 'root',
})
export class ParamsEncoderService {

    encodeSorters(sorters: CollectionSorter[] = []): string {
        return JSON.stringify(sorters);
    }

    encodeFilters(filters: CollectionFilter[] = []): string {
        const mappedFilters = filters.map(filter => ({
            type: filter.type,
            field: filter.field,
            operator: filter.operator,
            value: filter.value,
        }));
        return JSON.stringify(mappedFilters);
    }

}
