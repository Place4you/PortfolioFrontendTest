import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
	HttpInterceptor,
	HttpRequest,
	HttpResponse,
	HttpErrorResponse,
	HttpHandler,
	HttpEvent
} from '@angular/common/http';
import {
	Observable,
	throwError,
	of
} from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ErrorObject } from '@interfaces/errorObject.interface'

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
	constructor(private router: Router) { }
	
	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		const cachedResponse = this.getCache(request);
		if(cachedResponse) return of(cachedResponse);

		return next.handle(request).pipe(
			catchError((error: HttpErrorResponse) => {
				if(error && error.status && error.status === 403){
					this.router.navigate(['error403']);
				}
				if(error){
					if(error.status === 500 || error.statusText === "Unknown Error"){
						this.router.navigate(['error500']);
					}
					
				}
				let errorMsg: ErrorObject = {
					error: {
						type: "server",
						code: error.status || 500,
						message: error.error && error.error.message ? error.error.message : null
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

	private getCache(request: HttpRequest<any>): HttpResponse<any> | null {
		const cachedResponse = sessionStorage.getItem(request.url);
		if(cachedResponse) return new HttpResponse(JSON.parse(cachedResponse));
		return null;
	}

	private setCache(request: HttpRequest<any>, response: HttpResponse<any>): void {
		sessionStorage.setItem(request.url, JSON.stringify(response));
	}
}
