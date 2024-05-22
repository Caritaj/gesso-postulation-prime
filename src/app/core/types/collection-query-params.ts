import { CollectionFilter } from './collection-filter';
import { CollectionSorter } from './collection-sorter';

export interface CollectionQueryParams {
    page?: number;
    skip?: number;
    take?: number;
    sorter?: CollectionSorter[];
    filter?: CollectionFilter[];
    otherParams?: {
        [key: string]: number | string | boolean;
    };
}
