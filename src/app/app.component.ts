import { Component, Renderer2 } from '@angular/core';
import { CronTaskService } from './shared/services/crontask_for_backend.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html'
})
export class AppComponent {
	title: string = 'portfolio';

	constructor(private renderer: Renderer2, private cronTaskService: CronTaskService) {
		this.checkJavaScriptEnabled();
	}

	private checkJavaScriptEnabled() {
		const scriptElement = this.renderer.createElement('script');
		scriptElement.text = 'document.getElementById("js-disabled").style.display = "none";';
		this.renderer.appendChild(document.body, scriptElement);
	}

	ngOnInit(): void {
		this.cronTaskService.startPeriodicExecution();
	}
}
