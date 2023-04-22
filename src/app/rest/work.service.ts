import { Injectable } from '@angular/core';
import { HttpClientModule, HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http'
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WorkService {

  constructor(private http: HttpClient) { }

  uri: string = "http://localhost:8080/api/v1/work_item"

  getItem(id: number) {
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

  getItems() {
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
    date: string,
    technologies: string,
    description: string,
    code_uri: string,
    live_uri: string,
    image_uri: string,
    image_alt: string
    ) {
    const body = {
      name: name,
      date: date,
      technologies: technologies,
      description: description,
      code_uri: code_uri,
      live_uri: live_uri,
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
    date: string,
    technologies: string,
    description: string,
    code_uri: string,
    live_uri: string,
    image_uri: string,
    image_alt: string
  ) {
    const body = {
      id: id,
      name: name,
      date: date,
      technologies: technologies,
      description: description,
      code_uri: code_uri,
      live_uri: live_uri,
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


  deleteItem(token: string, id: number) {
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
