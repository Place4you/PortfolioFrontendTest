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
import { TableUserRes } from '../interfaces/tableUserRes.interface';
import { ApiService } from './api.service';

@Injectable({
	providedIn: 'root'
})
export class UserService {

	constructor(private http: HttpClient, private apiService: ApiService) { }

	uri: string = this.apiService.getApi() + "/user";

	getUser(token: string, id: number): Observable<HttpResponse<TableUserRes>> {
		return this.http.get<TableUserRes>(
			this.uri + `/${id}`,
			{
				headers: {'Authorization':token},
				observe: 'response',
				responseType: 'json'
			}
		);
	}

	getUsers(token: string): Observable<HttpResponse<TableUserRes[]>> {
		return this.http.get<TableUserRes[]>(
			this.uri,
			{
				headers: {'Authorization':token},
				observe: 'response',
				responseType: 'json'
			}
		);
	}

	createUser(
		token: string,
		name: string,
		email: string,
		password: string
	): Observable<HttpResponse<TableUserRes>> {
		const body = {
			name: name,
			email: email,
			password: password
		}
		return this.http.post<TableUserRes>(
			this.uri + "/add",
			body,
			{
				headers: {'Authorization':token},
				observe: 'response',
				responseType: 'json'
			}
		);
	}

	updateUser(
		token: string,
		id: number,
		name: string,
		email: string,
		password: string
	): Observable<HttpResponse<TableUserRes>> {
		const body = {
			id: id,
			name: name,
			email: email,
			password: password
		}
		return this.http.put<TableUserRes>(
			this.uri + "/update",
			body,
			{
				headers: {'Authorization':token},
				observe: 'response',
				responseType: 'json'
			}
		);
	}

	deleteUser(token: string, id: number): Observable<HttpResponse<{}>> {
		return this.http.delete<{}>(
			this.uri + `/delete/${id}`,
			{
				headers: {'Authorization':token},
				observe: 'response'
			}
		);
	}
}