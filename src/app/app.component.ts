import { Component, OnInit } from '@angular/core';
import { CronTaskService } from '@@shared/services/crontask_for_backend.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
	title: string = 'portfolio';

	constructor(private cronTaskService: CronTaskService) { }

	ngOnInit(): void {
		this.cronTaskService.startPeriodicExecution();
	}
}
