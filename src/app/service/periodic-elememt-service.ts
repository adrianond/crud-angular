import { Injectable, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PeriodicElement } from '../model/periodic-element';

@Injectable()
export class PeriodicElementService {
    elementUrlApi = 'http://localhost:8081/api/periodic/elements';

    constructor(private http: HttpClient) {
    }

    public getPeriodicElements(): Observable<PeriodicElement[]> {
        return this.http.get<PeriodicElement[]>(this.elementUrlApi);
    }

    public createElement(element: PeriodicElement): Observable<PeriodicElement> {
        console.log('criando', element)
        return this.http.post<PeriodicElement>(this.elementUrlApi, element);
    }

    public updateElement(id: number, element: PeriodicElement): void {
        console.log('alterando', element)
        this.http.put<PeriodicElement>(this.elementUrlApi+'/'+`${id}`, element);
    }

    public deleteElement(id: number): void {
        console.log('excluindo', id)
        this.http.delete<any>(this.elementUrlApi+'/'+`${id}`);
    }
}