import { Injectable } from '@angular/core';
import { 
	HttpClientModule, 
	HttpClient, 
	HttpHeaders, 
	HttpErrorResponse, 
	HttpResponse
} from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { TableAboutItemRes } from '../interfaces/tableAboutItemRes.interface';
import { environment } from '@app/../src/environments/environment.prod';

@Injectable({
	providedIn: 'root'
})
export class AboutService {

	private cachedItems: TableAboutItemRes[] | null = null;

	constructor(private http: HttpClient) { }

	uri: string = environment.apiUrl + "/about_item";


	getItem(id: number): Observable<HttpResponse<TableAboutItemRes>> {
		return this.http.get<TableAboutItemRes>(
			this.uri + `/${id}`,
			{
				observe: 'response',
				responseType: 'json'
			}
		);
	}

	getItems(): Observable<HttpResponse<TableAboutItemRes[]>> {
		if(this.cachedItems){
			return of(new HttpResponse({ body: this.cachedItems }));
		}
		return this.http.get<TableAboutItemRes[]>(
			this.uri,
			{
				observe: 'response',
				responseType: 'json'
			}
		).pipe(
			tap((res: HttpResponse<TableAboutItemRes[]>) => {
				if(res.ok) this.cachedItems = res.body;
			})
		);
	}

	createItem(
		token: string,
		type: number,
		name: string,
		date: string,
		description: string,
		itemData?: { link?: string, image_uri?: string, image_alt?: string }
	): Observable<HttpResponse<TableAboutItemRes>> {
		const body = {
			item_type: type,
			name: name,
			date: date,
			description: description,
			link: itemData?.link ?? null,
			image_uri: itemData?.image_uri ?? null,
			image_alt: itemData?.image_alt ?? null
		};
		return this.http.post<TableAboutItemRes>(
			this.uri + "/add",
			body,
			{
				headers: {'Authorization':token},
				observe: 'response',
				responseType: 'json'
			}
		);
	}

	updateItem(
		token: string,
		id: number,
		type: number,
		name: string,
		date: string,
		description: string,
		itemData?: { link?: string, image_uri?: string, image_alt?: string }
	): Observable<HttpResponse<TableAboutItemRes>> {
		const body = {
			id: id,
			name: name,
			item_type: type,
			date: date,
			description: description,
			link: itemData?.link ?? null,
			image_uri: itemData?.image_uri ?? null,
			image_alt: itemData?.image_alt ?? null
		};
		return this.http.put<TableAboutItemRes>(
			this.uri + "/update",
			body,
			{
				headers: {'Authorization':token},
				observe: 'response',
				responseType: 'json'
			}
		);
	}

	deleteItem(token: string, id: number): Observable<HttpResponse<{ }>> {
		return this.http.delete<{ }>(
			this.uri + `/delete/${id}`,
			{
				headers: {'Authorization':token},
				observe: 'response'
			}
		);
	}
}