import { Injectable } from '@angular/core';
import {
	HttpRequest,
	HttpHandler,
	HttpInterceptor,
	HttpResponse
} from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { LoaderService } from '@services/loader.service';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
	private totalRequests = 0;

	constructor(private loaderService: LoaderService) { }

	intercept(request: HttpRequest<any>, next: HttpHandler) {
		this.totalRequests++;
		this.loaderService.setLoading(true);

		return next.handle(request).pipe(
			finalize(() => {
				this.totalRequests--;
				if (this.totalRequests === 0) {
					this.loaderService.setLoading(false);
				}
			})
			);
	}
}