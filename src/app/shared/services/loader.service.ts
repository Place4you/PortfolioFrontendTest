import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class LoaderService {
	private activeRequests = 0;
	private isLoading$$ = new BehaviorSubject<boolean>(false);
	isLoading$ = this.isLoading$$.asObservable();

	setLoading(isLoading: boolean): void {
		this.isLoading$$.next(isLoading);
	}

	increaseRequestCount(): void {
		this.activeRequests++;
		if (this.activeRequests === 1) {
			this.setLoading(true);
		}
	}

	decreaseRequestCount(): void {
		this.activeRequests--;
		if (this.activeRequests === 0) {
			this.setLoading(false);
		}
	}
}
