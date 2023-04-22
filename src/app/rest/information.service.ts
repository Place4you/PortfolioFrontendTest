import { Injectable } from '@angular/core';
import { HttpClientModule, HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http'
import { catchError } from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})
export class InformationService {

	constructor(private http: HttpClient) { }

	uri: string = 'http://localhost:8080/api/v1/information';

	getInformationTable(){
		return this.http.get(
			this.uri,
			{
				observe: 'response',
				responseType: 'json'
			}
		);
	}

	editInformationTable(token: string, id: number, name: string, information: string){
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
		.pipe(
			catchError((err: HttpErrorResponse) => {
				return "0";
			})
		);
	}
}
