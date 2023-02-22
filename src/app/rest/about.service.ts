import { Injectable } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http'


@Injectable({
  providedIn: 'root'
})
export class AboutService {

  uri: string = 'http://localhost:8080/api/v1/about_item';

  constructor(private http: HttpClient) { }

  getItems(){
    return this.http.get(this.uri, {observe: 'response', responseType: 'json'});
  }

  getItem(id: number){
    return this.http.get(this.uri + `/${id}`, {observe: 'response', responseType: 'json'});
  }
}

// handle error with https://angular.io/guide/http#making-a-post-request
