import { Injectable } from '@angular/core';
import {
	HttpInterceptor,
	HttpRequest,
	HttpResponse,
	HttpErrorResponse,
	HttpHandler,
	HttpEvent
} from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ErrorObject } from '../interfaces/errorObject.interface'
import { Router } from '@angular/router'

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
	constructor(private router: Router) { }
	
	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		return next.handle(request).pipe(
			catchError((error: HttpErrorResponse) => {
				if(error && error.status && error.status === 401){
					this.router.navigate(['error401']);
				}
				if(error && error.status && error.status === 500){
					this.router.navigate(['error500']);
				}
				let errorMsg: ErrorObject = {
					error: {
						type: "server",
						code: error.status || 500,
						message: error.error && error.error.message ? error.error.message : "Unknown error"
					}
				};
				if(error.error instanceof ErrorEvent){
					errorMsg.error.type = "client";
					errorMsg.error.code = error.status || 400;
				}

				const httpError = new HttpResponse<ErrorObject>({
					status: error.status,
					body: errorMsg
				});

				return throwError(httpError);
			})
		);
	}
}
