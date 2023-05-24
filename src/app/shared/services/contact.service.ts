import { Injectable } from '@angular/core';
import { 
	HttpClientModule, 
	HttpClient, 
	HttpHeaders, 
	HttpErrorResponse, 
	HttpResponse 
} from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { TableContactItemRes, TableContactMessageRes } from '../interfaces/tableContactRes.interface';
import { environment } from '@app/../src/environments/environment.prod';

@Injectable({
	providedIn: 'root'
})
export class ContactService {

	constructor(private http: HttpClient) { }
	
	uri_ci: string = environment.apiUrl + "/contact_item";
	uri_cm: string = environment.apiUrl + "/contact_message";

	getItem(id: number): Observable<HttpResponse<TableContactItemRes>> {
		return this.http.get<TableContactItemRes>(
			this.uri_ci + `/${id}`,
			{
				observe: 'response',
				responseType: 'json'
			}
		);
	}

	getItems(): Observable<HttpResponse<TableContactItemRes[]>> {
		return this.http.get<TableContactItemRes[]>(
			this.uri_ci,
			{
				observe: 'response',
				responseType: 'json'
			}
		);
	}

	createItem(
		token: string,
		name: string,
		account: string,
		itemData?: { link?: string, image_uri?: string, image_alt?: string }
	): Observable<HttpResponse<TableContactItemRes>> {
		const body = {
			name: name,
			account: account,
			link: itemData?.link ?? null,
			image_uri: itemData?.image_uri ?? null,
			image_alt: itemData?.image_alt ?? null
		};
		return this.http.post<TableContactItemRes>(
			this.uri_ci + "/add",
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
		name: string,
		account: string,
		itemData?: { link?: string, image_uri?: string, image_alt?: string }
	): Observable<HttpResponse<TableContactItemRes>> {
		const body = {
			id: id,
			name: name,
			account: account,
			link: itemData?.link ?? null,
			image_uri: itemData?.image_uri ?? null,
			image_alt: itemData?.image_alt ?? null
		};
		return this.http.put<TableContactItemRes>(
			this.uri_ci + "/update",
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
			this.uri_ci + `/delete/${id}`,
			{
				headers: {'Authorization':token},
				observe: 'response'
			}
		);
	}

	getMessage(token: string, id: number): Observable<HttpResponse<TableContactMessageRes>> {
		return this.http.get<TableContactMessageRes>(
			this.uri_cm + `/${id}`,
			{
				headers: {'Authorization':token},
				observe: 'response',
				responseType: 'json'
			}
		);
	}

	getMessages(token: string): Observable<HttpResponse<TableContactMessageRes[]>> {
		return this.http.get<TableContactMessageRes[]>(
			this.uri_cm,
			{
				headers: {'Authorization':token},
				observe: 'response',
				responseType: 'json'
			}
		);
	}

	createMessage(
		subject: string,
		message: string,
		reply: string,
		date: string
	): Observable<HttpResponse<TableContactMessageRes>> {
		const body = {
			subject: subject,
			message: message,
			reply: reply,
			date: date,
			readed: false
		};
		return this.http.post<TableContactMessageRes>(
			this.uri_cm + "/add",
			body,
			{
				observe: 'response',
				responseType: 'json'
			}
		);
	}

	changeMessageRead(token: string, message: TableContactMessageRes): Observable<HttpResponse<TableContactMessageRes>> {
		const body = {
			id: message.id,
			subject: message.subject,
			message: message.message,
			reply: message.reply,
			date: message.date,
			readed: true
		};
		return this.http.put<TableContactMessageRes>(
			this.uri_cm + `/update`,
			body,
			{
				headers: {'Authorization':token},
				observe: 'response',
				responseType: 'json'
			}
		);
	}

	deleteMessage(token: string, id: number): Observable<HttpResponse<{ }>> {
		return this.http.delete<{ }>(
			this.uri_cm + `/delete/${id}`,
			{
				headers: {'Authorization':token},
				observe: 'response'
			}
		);
	}

}
