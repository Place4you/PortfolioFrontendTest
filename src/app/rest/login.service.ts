import { Injectable } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})

export class LoginService {

  uri: string = 'http://localhost:8080/';

  constructor(private http: HttpClient) { }

  login(email: string, password: string){
    return this.http.post(this.uri + 'login', { email: email, password: password }, {observe: 'response', responseType: 'text'});
    // handle error with https://angular.io/guide/http#making-a-post-request
  }
}


