import { Injectable } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class InformationService {

  constructor(private http: HttpClient) { }

  uri: string = 'http://localhost:8080/';

  getInformationTable(){
    return this.http.get(this.uri + 'api/v1/information', {observe: 'response', responseType: 'json'});
  }
}
