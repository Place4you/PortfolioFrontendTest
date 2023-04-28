import { Component, NgZone } from '@angular/core';
import { InformationService } from '../services/information.service';
import { TableInfoRes } from '../interfaces/tableInfoRes.interface';
import { HttpClientModule, HttpClient, HttpResponse } from '@angular/common/http'
import { ErrorObject } from '../interfaces/errorObject.interface'

@Component({
	selector: 'app-index',
	templateUrl: './index.component.html',
	styleUrls: ['./index.component.scss']
})
export class IndexComponent {

	constructor(private zone: NgZone, private informationService: InformationService) { }

	titles_array:  string[] = [];
	current_title: string | undefined = undefined;
	curr_title_i:  number = 0;
	second_after:  boolean = true;
	el:            HTMLElement | null = null;
	resize_ob:     ResizeObserver | undefined = undefined;

	
	current_alert: boolean = false;
	myAlert(message: string, type: string): void {
		const alertPlaceholder: HTMLElement | null = document.getElementById('liveAlertPlaceholder');
		if(!this.current_alert){
			this.current_alert = true;
			const wrapper: HTMLElement = document.createElement('div');
			wrapper.innerHTML = [
				`<div class="alert alert-${type}" role="alert">`,
				`   <div style="text-align: center;">${message}</div>`,
				'</div>'
				].join('');
			if(alertPlaceholder !== null){
				alertPlaceholder.append(wrapper);
				setTimeout(() => {
					alertPlaceholder.innerHTML = '';
					this.current_alert = false;
				}, 5000);
			}
		}
	}

	update_title(): void {
		if(this.el){
			this.resize_ob = new ResizeObserver((entries) => {
				this.zone.run(() => {
					if(entries !== null){
						if(this.el !== null && this.el.parentElement !== null){
							const parentElemWidth: number = +getComputedStyle(this.el.parentElement).width.slice(0, -2);
							const elemWidth: number = +getComputedStyle(this.el).width.slice(0, -2);

							if(Math.round((elemWidth / parentElemWidth) * 100) >= 93){
								if(this.second_after){
									this.current_title = this.titles_array[this.curr_title_i];
									this.curr_title_i++;
									if(this.curr_title_i >= this.titles_array.length){
										this.curr_title_i = 0;
									}
									this.second_after = false;
									setTimeout(() => this.second_after = true, 1000);
								}
							}
						}
					}
				})
			});
			this.resize_ob.observe(this.el);
		}
	}

	ngOnInit(): void {
		this.informationService.getInformationTable()
		.subscribe(
			(response: HttpResponse<TableInfoRes[]>): void  => {
				if(response.body !== null){
					for(let i: number = 0; i < response.body.length; i++){
						if(response.body[i].name === "index_titles" && response.body[i].information){
							this.titles_array = response.body[i].information.split(',');
							break;
						}
					}
				}
			},
			(error: HttpResponse<ErrorObject>): void => {
				if(error.body !== null){
					this.myAlert(error.body.error.message ?? 'Unknown error while retrieving the information table', 'danger');
					console.error(error.body.error);
				}
			}
		);
		this.el = document.querySelector("#home_title_box");
		this.update_title();
	}

	ngOnDestroy(): void {
		if(this.resize_ob && this.el){
			this.resize_ob.unobserve(this.el);
		}
	}
}
