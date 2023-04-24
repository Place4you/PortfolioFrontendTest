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

@Injectable({
	providedIn: 'root'
})
export class InformationService {

	constructor(private http: HttpClient) { }

	uri: string = 'http://localhost:8080/api/v1/information';

	getInformationTable(): Observable<string | HttpResponse<Object>> {
		return this.http.get(
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
	): Observable<string | HttpResponse<Object>> {
		return this.http.put(
			this.uri + '/update',
			{
				id: id,
				name: name,
				information:
				information
			},
			{
				headers: {'Authorization':token},
				observe: 'response',
				responseType: 'text'
			}
		)
	}
}
