import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpInterceptor } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { LoaderService } from '@@shared/services/loader.service';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
	constructor(private loaderService: LoaderService) { }

	intercept(request: HttpRequest<any>, next: HttpHandler) {
		this.loaderService.increaseRequestCount();

		return next.handle(request).pipe(
			finalize(() => {
				this.loaderService.decreaseRequestCount();
			})
		);
	}
}
