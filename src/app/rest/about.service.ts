import { Injectable } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class AboutService {

  constructor(private http: HttpClient) { }

  getItems(){
    return this.http.get("http://localhost:8080/api/v1/about_item", {observe: 'response', responseType: 'json'});
  }
}

// handle error with https://angular.io/guide/http#making-a-post-request
