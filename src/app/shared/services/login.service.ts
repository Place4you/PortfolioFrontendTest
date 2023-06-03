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
import { environment } from '@app/../src/environments/environment.prod';

@Injectable({
	providedIn: 'root'
})
export class LoginService {

	constructor(private http: HttpClient) { }

	uri: string = environment.apiUrl;

	login(email: string, password: string): Observable<HttpResponse<string>> {
		return this.http.post(
			this.uri + '/login',
			{
				email: email,
				password: password
			},
			{
				observe: 'response',
				responseType: 'text'
			}
		);
	}

	checkToken(token: string): Observable<HttpResponse<{ }>> {
		return this.http.delete<{ }>(
			this.uri + '/about_item/check_token',
			{
				headers: {'Authorization':token},
				observe: 'response',
				responseType: 'json'
			}
		);
	}
}
