import { Component, NgZone, OnInit, OnDestroy } from '@angular/core';
import {
	HttpClientModule,
	HttpClient,
	HttpResponse
} from '@angular/common/http';
import { InformationService } from '@@shared/services/information.service';
import { AlertService } from '@@shared/services/alert.service';
import { ErrorObject } from '@@shared/interfaces/errorObject.interface';
import { TableInfoRes } from '@@shared/interfaces/tableInfoRes.interface';

@Component({
	selector: 'app-index',
	templateUrl: './index.component.html',
	styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit,OnDestroy {

	constructor(
		private alertService: AlertService, 
		private zone: NgZone, 
		private informationService: InformationService
	) { }

	titlesArray:		string[] = [];
	currentTitle:		string | undefined = undefined;
	currTitleIndex:		number = 0;
	secondAfter:		boolean = true;
	el:					HTMLElement | null = null;
	resizeObserver:		ResizeObserver | undefined = undefined;

	updateTitle(): void {
		if (this.el) {
			this.resizeObserver = new ResizeObserver((entries) => {
				this.zone.run(() => {
					if (entries !== null) {
						if (this.el !== null && this.el.parentElement !== null) {
							const parentElemWidth: number = 
								+getComputedStyle(this.el.parentElement, null)
								.width.slice(0, -2),
							elemWidth: number = 
								+getComputedStyle(this.el, null)
								.width.slice(0, -2);

							if (Math.round((elemWidth / parentElemWidth) * 100) >= 93) {
								if (this.secondAfter) {
									this.currentTitle = this.titlesArray[this.currTitleIndex];
									this.currTitleIndex++;
									if (this.currTitleIndex >= this.titlesArray.length) this.currTitleIndex = 0;
									this.secondAfter = false;
									setTimeout(() => this.secondAfter = true, 1000);
								}
							}
						}
					}
				})
			});
			this.resizeObserver.observe(this.el);
		}
	}

	ngOnInit(): void {
		this.informationService.getInformationTable()
		.subscribe(
			(response: HttpResponse<TableInfoRes[]>): void  => {
				if (response.body !== null) {
					for (let infoItem of response.body) {
						if (infoItem.name === "index_titles" && infoItem.information) {
							this.titlesArray = infoItem.information.split(',');
							break;
						}
					}
				}
			},
			(error: HttpResponse<ErrorObject>): void => {
				this.alertService.myAlert(error.body?.error.message ?? 'Unknown error while retrieving the information table', 'danger');
				console.error(error.body?.error);
			}
		);
		this.el = document.querySelector("#homeTitleBox");
		this.updateTitle();
	}

	ngOnDestroy(): void {
		if (this.resizeObserver && this.el) this.resizeObserver.unobserve(this.el);
	}
}
