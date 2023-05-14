import { Injectable } from '@angular/core';
import { 
	HttpClientModule, 
	HttpClient, 
	HttpHeaders, 
	HttpErrorResponse, 
	HttpResponse 
} from '@angular/common/http'
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { TableInfoRes } from '../interfaces/tableInfoRes.interface';
import { environment } from '@app/../src/environments/environment.prod';

@Injectable({
	providedIn: 'root'
})
export class InformationService {

	constructor(private http: HttpClient) {
		interface InformationTableResponse {
			id: number,
			name: string,
			information: string
		}
	}

	uri: string = environment.apiUrl + "/information";

	getInformationTable(): Observable<HttpResponse<TableInfoRes[]>> {
		return this.http.get<TableInfoRes[]>(
			this.uri,
			{
				observe: 'response',
				responseType: 'json'
			}
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
		)
	}
}
