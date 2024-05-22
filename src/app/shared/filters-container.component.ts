import { Output, EventEmitter, Directive, Input } from '@angular/core';
import { debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Filter } from '../core/types/filter';
import { FilterOperator } from '../core/types/filter-operator';

@Directive()
export class FiltersContainerComponent {
    @Input() debounceTime: number = 700;
    @Output() filtersChange: EventEmitter<Filter[]> = new EventEmitter();
    @Output() searchFilterChange: EventEmitter<Filter> = new EventEmitter();
    @Output() refreshClick = new EventEmitter<void>();
    filters: Filter[] = [];
    activeFilters: Filter[] = [];
    searchFilter!: Filter;
    private filtersSubject = new Subject();
    private filters$ = this.filtersSubject.asObservable();
    constructor() {
        const me = this;
        me.filters$.pipe(debounceTime(me.debounceTime)).subscribe((_) => {
            me.fireEvent();
        });
    }
    setFilterValue(
        id: string,
        value: any,
        active?: boolean,
        operator?: FilterOperator
    ): void {
        const me = this;
        const filter = me.getFilter(id);
        if (filter) {
            filter.value = value;
            filter.active = true;
            filter.operator = operator ?? filter.operator;
            // Posibilidades de desactivar el filtro
            if (value === filter.activeFalseValue || value === null || value === undefined || value === '' || value?.length === 0) {
                filter.active = false;
            }
            // El valor active predomina si es establecido esplicitamente
            if (active === true || active === false) {
                filter.active = active;
            }
        }
        me.notifyChanges();
    }

    setSearchFilterValue(value: string): void {
        this.searchFilter = { ...this.searchFilter, value };
        this.searchFilterChange.emit(this.searchFilter);
    }

    activeFilter(field: string, active: boolean): void {
        const me = this;
        me.filters.forEach((item) => {
            if (item.field === field) {
                item.active = !!active;
            }
        });
    }
    addOrRemoveListFilterItemValue(id: string, itemValue: any, add: boolean): void {
        const me = this;
        let newValue = [];
        const filter = me.getFilter(id);
        if (filter) {
            newValue = filter.value || [];
            // Add value
            if (add) {
                // Valor no está en la lista
                if (newValue.indexOf(itemValue) === -1) {
                    newValue.push(itemValue);
                }
            }
            // Remove value
            else {
                newValue = newValue.filter((value: any) => value !== itemValue);
            }
            filter.value = newValue;
        }
        me.notifyChanges();
    }

    notifyChanges(): void {
        this.activeFilters = this.getActiveFilters();
        this.filtersSubject.next(null);
    }

    fireEvent(): void {
        this.filtersChange.emit(this.activeFilters);
    }

    /**
     * Retorna solo los filtros activos
     */
    getActiveFilters(): Filter[] {
        const out = this.filters.filter((filter) => {
            if (filter.type === 'list') {
                return !!filter.value?.length;
            }
            return filter.active;
        });
        return out;
    }

    getFilter(id: string): Filter | null {
        const me = this;
        let out = null;
        me.filters.forEach((item) => {
            if (item.id === id) {
                out = item;
            }
        });
        return out;
    }

    resetFilters(): void {
        this.filters.forEach((item) => {
            item.active = false;
            item.value = undefined;
        });
        this.notifyChanges();
    }

}
