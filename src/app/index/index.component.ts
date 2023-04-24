import { Component, NgZone } from '@angular/core';
import { InformationService } from '../services/information.service';

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
			(response: any): void  => {
				for(let i: number = 0; i < response.body.length; i++){
					if(response.body[i].name === "index_titles" && response.body[i].information){
						this.titles_array = response.body[i].information.split(',');
						break;
					}
				}
			},
			(error: any): void => {
				console.log(error.body.error);
				// redirect to error pages
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
