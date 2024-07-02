import { RedirectionService } from '@@shared/services/redirection.service';
import { Component, OnInit } from '@angular/core';
@Component({
	selector: 'app-root',
	templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
	title: string = 'portfolio';

	constructor(private redirectionService: RedirectionService) { }

	ngOnInit(): void {
		this.redirectionService.checkAndRedirect();
	}
}
