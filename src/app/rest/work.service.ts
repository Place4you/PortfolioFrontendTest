import { Injectable } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class WorkService {

  constructor(private http: HttpClient) { }

  getItems(){
    return this.http.get("http://localhost:8080/api/v1/work_item", {observe: 'response', responseType: 'json'});
  }
}
