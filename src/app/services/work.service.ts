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
import { TableWorkItemRes } from '../interfaces/tableWorkItemRes.interface';
import { ApiService } from './api.service';

@Injectable({
	providedIn: 'root'
})
export class WorkService {

	constructor(private http: HttpClient, private apiService: ApiService) { }

	uri: string = this.apiService.getApi() + "/work_item";

	getItem(id: number): Observable<HttpResponse<TableWorkItemRes>> {
		return this.http.get<TableWorkItemRes>(
			this.uri + `/${id}`,
			{
				observe: 'response',
				responseType: 'json'
			}
		)
	}

	getItems(): Observable<HttpResponse<TableWorkItemRes[]>> {
		return this.http.get<TableWorkItemRes[]>(
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
		itemData?: { code_uri?: string, live_uri?: string, image_uri?: string, image_alt?: string }
	): Observable<HttpResponse<TableWorkItemRes>> {
		const body = {
			name: name,
			date: date,
			technologies: technologies,
			description: description,
			code_uri: itemData?.code_uri ?? null,
			live_uri: itemData?.live_uri ?? null,
			image_uri: itemData?.image_uri ?? null,
			image_alt: itemData?.image_alt ?? null
		}
		return this.http.post<TableWorkItemRes>(
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
		itemData?: { code_uri?: string, live_uri?: string, image_uri?: string, image_alt?: string }
	): Observable<HttpResponse<TableWorkItemRes>> {
		const body = {
			id: id,
			name: name,
			date: date,
			technologies: technologies,
			description: description,
			code_uri: itemData?.code_uri ?? null,
			live_uri: itemData?.live_uri ?? null,
			image_uri: itemData?.image_uri ?? null,
			image_alt: itemData?.image_alt ?? null
		}
		return this.http.put<TableWorkItemRes>(
			this.uri + "/update",
			body,
			{
				headers: {'Authorization':token},
				observe: 'response',
				responseType: 'json'
			}
		)
	}

	deleteItem(token: string, id: number): Observable<HttpResponse<{}>> {
		return this.http.delete<{}>(
			this.uri + `/delete/${id}`,
			{
				headers: {'Authorization':token},
				observe: 'response'
			}
		)
	}
}
