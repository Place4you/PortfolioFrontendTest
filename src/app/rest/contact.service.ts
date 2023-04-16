import { Injectable } from '@angular/core';
import { HttpClientModule, HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http'
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  constructor(private http: HttpClient) { }

  uri_ci: string = "http://localhost:8080/api/v1/contact_item"
  uri_cm: string = "http://localhost:8080/api/v1/contact_message"

  getItem(id: number){
    return this.http.get(
      this.uri_ci + `/${id}`,
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
      this.uri_ci,
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
      this.uri_ci + "/add",
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
      this.uri_ci + "/update",
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
      this.uri_ci + `/delete/${id}`,
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



  createMessage(
    subject: string,
    message: string,
    reply: string,
    date: string
  ){
    const body = {
      subject: subject,
      message: message,
      reply: reply,
      date: date,
      read: false
    }
    return this.http.post(
      this.uri_cm + "/add",
      body,
      {
        observe: 'response',
        responseType: 'json'
      }
    )
    .pipe(
      catchError((err: HttpErrorResponse) => {
        return "0";
      })
    );
  }

}
