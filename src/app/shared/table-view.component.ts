/**
 * Component Base Class Table
 */
import {
    AfterViewInit, Directive, EventEmitter,
    HostListener, Injector, OnInit,
    Output, ViewChild,
} from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';

import { Observable, Subject, Subscription, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { CollectionFilter } from 'src/app/types/collection-filter';
import { NotificationService } from '../../service/notification/notification.service';
import { CollectionQueryParams } from 'src/app/types/collection-query-params';



@Directive()
export class TableViewComponent<T> implements OnInit, AfterViewInit {

    @ViewChild(MatTable) table?: MatTable<T>;
    @ViewChild(MatSort) sort?: MatSort;
    @ViewChild(MatPaginator) paginator?: MatPaginator;
    @Output() selectionChange = new EventEmitter<T[]>();

    // @config llama a loadData inmediatamente
    autoload = true;
    // Propiedades disponibles
    pageSize = 10;
    pageIndex = 0;
    pageSizeOptions = [10, 25, 50, 100];
    serviceResponseDataProperty = 'data';
    filters: CollectionFilter[] = [];
    _loadSubcription?: Subscription;
    _isLoadingData = false;
    _didLoadDataFailed = false;
    selectionMultiple: boolean = false;
    selection = new SelectionModel<any>(this.selectionMultiple, []);
    // Guarda una copia del array de datos recibidos del servicio,
    // Nota: solo se clonan los objetos de primer nivel usando
    // map(e => { return { ...e } });
    _rawData!: T[];
    // Guarda una copia de la data que ha pasado por el metodo transformServiceResponseData
    _rawTransformedData!: T[];
    // Contiene la data que es visualizada en la interfaz
    data!: T[];
    totalRecords = 0;
    protected notificacionService: NotificationService;
    private loadObs = new Subject();
    private load = this.loadObs.asObservable();

    constructor(
        injector: Injector,
    ) {
        this.notificacionService = injector.get(NotificationService);
    }

    // Keyboard listeners
    @HostListener('window:keyup', ['$event'])
    keyEvent(e: KeyboardEvent): void {
        const me = this;
        if ((e.target as Element).tagName !== 'BODY') {
            return;
        }
        // Permite actualizar la data presionando la tecla A
        if (e.code === 'KeyA') {
            me.loadData();
            return;
        }
    }

    ngOnInit(): void {
        const me = this;
        me._subscribeLoadEvent();
        me.subscribeRouteParams();
        me.loadDatasets();
        me._createSelectionModel();
        if (me.autoload) {
            me.loadData();
        }
    }

    ngAfterViewInit(): void {
        const me = this;
        if (me.paginator) {
            me.paginator._intl.itemsPerPageLabel = 'Registros por página';
            me.paginator._intl.nextPageLabel = 'Siguiente';
            me.paginator._intl.previousPageLabel = 'Atrás';

            me.sort?.sortChange.subscribe(() => {
                if (me.paginator) {
                    me.paginator.pageIndex = 0;
                }
                me.loadData();
            });

            me.paginator.page.subscribe(() => {
                me.loadData();
            });
        }
    }


    subscribeRouteParams(): void { }

    loadDatasets(): void { }

    _createSelectionModel(): void {
        const me = this;
        me.selection = new SelectionModel<T>(me.selectionMultiple, []);
        me.selection.changed.subscribe((selection) => {
            me.selectionChange.emit(selection.source.selected);
        });
    }

    getPageIndex(): number {
        return this.paginator ? this.paginator.pageIndex : this.pageIndex;
    }

    getPageSize(): number {
        return this.paginator ? this.paginator.pageSize : this.pageSize;
    }

    getItemNumber(index: number): number {
        return this.getPageIndex() * this.getPageSize() + index + 1;
    }

    getCollectionQueryParams(includePage: boolean = false): CollectionQueryParams {
        const me = this;
        const paginator = me.paginator;
        const sorter = me.sort;
        const filters = me.getFilters();
        const out: CollectionQueryParams = {};
        // Paginación
        if (paginator) {
            out.skip = paginator.pageIndex;
            out.take = paginator.pageSize;
            if (includePage) {
                out.page = paginator.pageIndex;
            }
        } else {
            out.skip = me.pageIndex;
            out.take = me.pageSize;
            if (includePage) {
                out.page = me.pageIndex;
            }
        }
        // Filters
        if (filters && filters.length) {
            out.filter = filters;
        }
        // Sorters
        // Por ahora solo está soportando un simple sort
        if (sorter && sorter.active && sorter.direction) {
            out.sorter = [{ field: sorter.active, direction: sorter.direction }];
        }
        return out;
    }

    getFilters(): CollectionFilter[] {
        return this.filters;
    }

    onFiltersChange(filters: CollectionFilter[]): void {
        this.applyFilters(filters);
    }

    onSearchFilterChange(filter: CollectionFilter): void {
        console.log(filter);
    }

    applyFilters(filters: CollectionFilter[]): void {
        const me = this;
        me.filters = filters;
        me.resetPageIndex();
        me.loadData();
    }

    resetPageIndex(): void {
        const me = this;
        if (me.paginator) {
            me.paginator.pageIndex = 0;
        }
    }

    loadData(): void {
        this.loadObs.next(null);
    }

    _subscribeLoadEvent(): void {
        const me = this;
        me._loadSubcription = me.load
            .pipe(
                switchMap(() => {
                    me._isLoadingData = true;
                    me._didLoadDataFailed = false;
                    return me.getListService().pipe(
                        catchError((xhr) => {
                            me._isLoadingData = false;
                            me._didLoadDataFailed = true;
                            me.handleServerError(xhr);
                            return of(null);
                        })
                    );
                })
            )
            .subscribe((res: any) => {
                // When error has happened and was catched by catchError
                if (me._didLoadDataFailed) {
                    return;
                }
                let data: T[] = [];
                let total = 0;
                // res: {data: any[], total: number }
                if (
                    Object.prototype.toString.call(res) === '[object Object]' &&
                    Array.isArray(res[me.serviceResponseDataProperty])
                ) {
                    data = res[me.serviceResponseDataProperty];
                    if (isNaN(res.total)) {
                        total = data.length;
                    } else {
                        total = +res.total > data.length ? +res.total : data.length;
                    }
                }
                // res: any[]
                else if (Array.isArray(res)) {
                    data = res;
                    total = res.length;
                }
                me._rawData = data.map(e => ({ ...e }));
                me._rawTransformedData = me.transformServiceResponseData(data);
                me.data = me._rawTransformedData.map(e => ({ ...e }));
                me.totalRecords = total;
                me._isLoadingData = false;
            });
    }

    transformServiceResponseData(data: any): T[] {
        return data;
    }

    /**
     * Filtra por todas las columnas
     *
     * @param text Texto buscado
     */
    filterData(text: string): void {
        const me = this;
        text = (text || '').toString().trimStart().toLowerCase();
        me.data = me._rawTransformedData.filter((item: any) =>
            Object.keys(item).some((key) => {
                const value = (item[key] || '').toString().toLowerCase();
                return value.includes(text.toLowerCase());
            })
        );
    }

    getListService(): Observable<any> {
        return of(null);
    }

    /**
     * Solo notificará los errores de servidor componentes tipo component
     */
    handleServerError(xhr: any): void {
        this.notificacionService.handleXhrError(xhr);
    }

}
