import { Injectable } from '@angular/core';
import { HttpClientModule, HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http'
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  constructor(private http: HttpClient) { }

  uri: string = "http://localhost:8080/api/v1/contact_item"

  getItem(id: number){
    return this.http.get(
      this.uri + `/${id}`,
      {
        observe: 'response',
        responseType: 'json'
      })
    .pipe(
      catchError((err: HttpErrorResponse) => {
        return "0";
      })
    );
  }

  getItems(){
    return this.http.get(
      this.uri,
      {
        observe: 'response',
        responseType: 'json'
      });
  }

  createItem(
    token: string,
    name: string,
    account: string,
    link: string,
    image_uri: string,
    image_alt: string
    ){
    const body = {
      name: name,
      account: account,
      link: link,
      image_uri: image_uri,
      image_alt: image_alt
    }
    return this.http.post(
      this.uri + "/add",
      body,
      {
        headers: {'Authorization':token},
        observe: 'response',
        responseType: 'json'
      })
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
  ){
    const body = {
      id: id,
      name: name,
      account: account,
      link: link,
      image_uri: image_uri,
      image_alt: image_alt
    }
    return this.http.put(
      this.uri + "/update",
      body,
      {
        headers: {'Authorization':token},
        observe: 'response',
        responseType: 'json'
      })
    .pipe(
      catchError((err: HttpErrorResponse) => {
        return "0";
      })
    );
  }


  deleteItem(token: string, id: number){
    return this.http.delete(
      this.uri + `/delete/${id}`,
      {
        headers: {'Authorization':token},
        observe: 'response',
        responseType: 'json'
      })
    .pipe(
      catchError((err: HttpErrorResponse) => {
        return "0";
      })
    );
  }

}
