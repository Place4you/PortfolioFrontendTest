import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class ApiService {
	getApi(): string {
		return "https://ap-portfolio-backend.onrender.com";
	}
}