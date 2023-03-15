import { Injectable } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class InformationService {

  constructor(private http: HttpClient) { }

  getInformationTable(){
    return this.http.get("http://localhost:8080/api/v1/information", {observe: 'response', responseType: 'json'});
  }
}
