import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@app/../src/environments/environment.prod';

@Injectable({
	providedIn: 'root'
})
export class CronTaskService {
	constructor(private http: HttpClient) { }

	startPeriodicExecution() {
		setInterval(() => {
			this.sendHttpRequest();
		}, 10 * 60 * 1000);
	}

	sendHttpRequest() {
		const uri: string = environment.apiUrl + "/information";

		this.http.get(uri).subscribe(
			response => console.log(`Request sent to ${uri}`),
			error => console.error(`Error sending request to ${uri}`)
		);
	}
}
