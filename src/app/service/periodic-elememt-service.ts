import { Injectable, NgModule } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PeriodicElement } from '../model/periodic-element';
import { PeriodicElementsResponse } from '../model/response/periodic-elements-response';
import { PeriodicElementResponse } from '../model/response/periodic-element-response';


@Injectable()
export class PeriodicElementService {
    elementUrlApi = 'http://localhost:8081/api/periodic/elements';

    constructor(private http: HttpClient) {
    }

    public getPeriodicElements(): Observable<PeriodicElementsResponse> {
        return this.http.get<PeriodicElementsResponse>(this.elementUrlApi);
    }

    public createElement(element: PeriodicElement): Observable<PeriodicElementResponse> {
        return this.http.post<PeriodicElementResponse>(this.elementUrlApi, element);
    }

    public updateElement(id: number, element: PeriodicElement): Observable<PeriodicElementResponse> {
        return this.http.put<PeriodicElementResponse>(this.elementUrlApi+'/'+`${id}`, element);
    }

    public deleteElement(id: number): Observable<any> {
        return this.http.delete<any>(this.elementUrlApi+'/'+`${id}`);
    }
}