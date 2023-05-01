import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class ApiService {
	getApi(): string {
		return "http://localhost:8080/api/v1";
	}
}