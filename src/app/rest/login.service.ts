import { Injectable } from '@angular/core';
import { HttpClientModule, HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http'
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }

  uri: string = 'http://localhost:8080/';

  login(email: string, password: string){
    return this.http.post(this.uri + 'login', { email: email, password: password }, {observe: 'response', responseType: 'text'});
  }

  check_token(token: string){
    return this.http.delete(this.uri + 'api/v1/about_item/check_token', {headers: {'Authorization':token}, observe: 'response', responseType: 'text'})
    .pipe(
      catchError((err: HttpErrorResponse) => {
        return "0";
      })
    );
  }
}


