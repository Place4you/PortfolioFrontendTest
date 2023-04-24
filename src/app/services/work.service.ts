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
export class WorkService {

	constructor(private http: HttpClient) { }

	uri: string = "http://localhost:8080/api/v1/work_item"

	getItem(id: number): Observable<string | HttpResponse<Object>> {
		return this.http.get(
			this.uri + `/${id}`,
			{
				observe: 'response',
				responseType: 'json'
			}
		)
	}

	getItems(): Observable<string | HttpResponse<Object>> {
		return this.http.get(
			this.uri,
			{
				observe: 'response',
				responseType: 'json'
			}
		);
	}

	createItem(
		token: string,
		name: string,
		date: string,
		technologies: string,
		description: string,
		code_uri: string,
		live_uri: string,
		image_uri: string,
		image_alt: string
	): Observable<string | HttpResponse<Object>> {
		const body = {
			name: name,
			date: date,
			technologies: technologies,
			description: description,
			code_uri: code_uri,
			live_uri: live_uri,
			image_uri: image_uri,
			image_alt: image_alt
		}
		return this.http.post(
			this.uri + "/add",
			body,
			{
				headers: {'Authorization':token},
				observe: 'response',
				responseType: 'json'
			}
		)
	}

	updateItem(
		token: string,
		id: number,
		name: string,
		date: string,
		technologies: string,
		description: string,
		code_uri: string,
		live_uri: string,
		image_uri: string,
		image_alt: string
	): Observable<string | HttpResponse<Object>> {
		const body = {
			id: id,
			name: name,
			date: date,
			technologies: technologies,
			description: description,
			code_uri: code_uri,
			live_uri: live_uri,
			image_uri: image_uri,
			image_alt: image_alt
		}
		return this.http.put(
			this.uri + "/update",
			body,
			{
				headers: {'Authorization':token},
				observe: 'response',
				responseType: 'json'
			}
		)
	}

	deleteItem(token: string, id: number): Observable<string | HttpResponse<Object>> {
		return this.http.delete(
			this.uri + `/delete/${id}`,
			{
				headers: {'Authorization':token},
				observe: 'response',
				responseType: 'json'
			}
		)
	}
}
