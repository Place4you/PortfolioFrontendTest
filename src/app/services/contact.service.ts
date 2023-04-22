import { Injectable } from '@angular/core';
import { HttpClientModule, HttpClient, HttpHeaders, HttpErrorResponse, HttpResponse } from '@angular/common/http'
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Message } from '../admin/views/admin-contact/interfaces';

@Injectable({
	providedIn: 'root'
})
export class ContactService {

	constructor(private http: HttpClient) { }

	uri_ci: string = "http://localhost:8080/api/v1/contact_item"
	uri_cm: string = "http://localhost:8080/api/v1/contact_message"

	getItem(id: number): Observable<string | HttpResponse<Object>> {
		return this.http.get(
			this.uri_ci + `/${id}`,
			{
				observe: 'response',
				responseType: 'json'
			}
		)
		.pipe(
			catchError((err: HttpErrorResponse) => {
				return "0";
			})
		);
	}

	getItems(): Observable<string | HttpResponse<Object>> {
		return this.http.get(
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
		link: string,
		image_uri: string,
		image_alt: string
	): Observable<string | HttpResponse<Object>> {
		const body = {
			name: name,
			account: account,
			link: link,
			image_uri: image_uri,
			image_alt: image_alt
		}
		return this.http.post(
			this.uri_ci + "/add",
			body,
			{
				headers: {'Authorization':token},
				observe: 'response',
				responseType: 'json'
			}
		)
		.pipe(
			catchError((err: HttpErrorResponse) => {
				return "0";
			})
		);
	}

	updateItem(
		token: string,
		id: number,
		name: string,
		account: string,
		link: string,
		image_uri: string,
		image_alt: string
	): Observable<string | HttpResponse<Object>> {
		const body = {
			id: id,
			name: name,
			account: account,
			link: link,
			image_uri: image_uri,
			image_alt: image_alt
		}
		return this.http.put(
			this.uri_ci + "/update",
			body,
			{
				headers: {'Authorization':token},
				observe: 'response',
				responseType: 'json'
			}
		)
		.pipe(
			catchError((err: HttpErrorResponse) => {
				return "0";
			})
		);
	}

	deleteItem(token: string, id: number): Observable<string | HttpResponse<Object>> {
		return this.http.delete(
			this.uri_ci + `/delete/${id}`,
			{
				headers: {'Authorization':token},
				observe: 'response',
				responseType: 'json'
			}
		)
		.pipe(
			catchError((err: HttpErrorResponse) => {
				return "0";
			})
		);
	}

	getMessage(token: string, id: number): Observable<string | HttpResponse<Object>> {
		return this.http.get(
			this.uri_cm + `/${id}`,
			{
				headers: {'Authorization':token},
				observe: 'response',
				responseType: 'json'
			}
		)
		.pipe(
			catchError((err: HttpErrorResponse) => {
				return "0";
			})
		);
	}

	getMessages(token: string): Observable<string | HttpResponse<Object>> {
		return this.http.get(
			this.uri_cm,
			{
				headers: {'Authorization':token},
				observe: 'response',
				responseType: 'json'
			}
		)
		.pipe(
			catchError((err: HttpErrorResponse) => {
				return "0";
			})
		);
	}

	createMessage(
		subject: string,
		message: string,
		reply: string,
		date: string
	): Observable<string | HttpResponse<Object>> {
		const body = {
			subject: subject,
			message: message,
			reply: reply,
			date: date,
			read: false
		}
		return this.http.post(
			this.uri_cm + "/add",
			body,
			{
				observe: 'response',
				responseType: 'json'
			}
		)
		.pipe(
			catchError((err: HttpErrorResponse) => {
				return "0";
			})
		);
	}

	changeMessageRead(token: string, message: Message): Observable<string | HttpResponse<Object>> {
		const body = {
			id: message.id,
			subject: message.subject,
			message: message.message,
			reply: message.reply,
			date: message.date,
			read: true
		}
		return this.http.put(
			this.uri_cm + `/update`,
			body,
			{
				headers: {'Authorization':token},
				observe: 'response',
				responseType: 'json'
			}
		)
		.pipe(
			catchError((err: HttpErrorResponse) => {
				return "0";
			})
		);
	}

	deleteMessage(token: string, id: number): Observable<string | HttpResponse<Object>> {
		return this.http.delete(
			this.uri_cm + `/delete/${id}`,
			{
				headers: {'Authorization':token},
				observe: 'response',
				responseType: 'json'
			}
		)
		.pipe(
			catchError((err: HttpErrorResponse) => {
				return "0";
			})
		);
	}

}
