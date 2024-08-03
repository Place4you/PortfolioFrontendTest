import { environment } from '@@environments/environment.prod';
import {
	HttpClient,
	HttpClientModule,
	HttpErrorResponse,
	HttpHeaders,
	HttpResponse
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { TableInfoRes } from '../interfaces/tableInfoRes.interface';

@Injectable({
	providedIn: 'root'
})
export class InformationService {

	private cachedTable: TableInfoRes[] | null = null;

	constructor(private http: HttpClient) { }

	uri: string = environment.apiUrl + "/information";

	getInformationTable(): Observable<HttpResponse<TableInfoRes[]>> {
		if(this.cachedTable){
			return of(new HttpResponse({ body: this.cachedTable }));
		}
		return this.http.get<TableInfoRes[]>(
			this.uri,
			{
				observe: 'response',
				responseType: 'json'
			}
		).pipe(
			tap((res: HttpResponse<TableInfoRes[]>) => {
				if(res.ok) this.cachedTable = res.body;
			})
		);
	}

	editInformationTable(
		token: string,
		id: number,
		name: string,
		information: string
	): Observable<HttpResponse<TableInfoRes>> {
		return this.http.put<TableInfoRes>(
			this.uri + '/update',
			{
				id: id,
				name: name,
				information: information
			},
			{
				headers: {'Authorization':token},
				observe: 'response',
				responseType: 'json'
			}
		);
	}
}
