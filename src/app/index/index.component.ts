import { Component, NgZone } from '@angular/core';
import { InformationService } from '../rest/information.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent {

  constructor(private zone: NgZone, private informationService: InformationService) { }

  titles_array:  string[] = [];
  current_title: string = "";
  curr_title_i:  number = 0;
  second_after:  boolean = true;
  el:            any = undefined;
  resize_ob:     any = undefined;

  update_title(): void{
    if(this.el !== null){
      this.resize_ob = new ResizeObserver((entries) => {
        this.zone.run(() => {
          if(entries !== null){
            if(this.el.parentElement !== null){
              const parentElemWidth = +getComputedStyle(this.el.parentElement).width.slice(0, -2);
              const elemWidth = +getComputedStyle(this.el).width.slice(0, -2);

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


  ngOnInit(){
    this.informationService.getInformationTable()
    .subscribe((response: any) => {
      for(let i: number = 0; i < response.body.length; i++){
        if(response.body[i].name === "index_titles" && response.body[i].information){
          this.titles_array = response.body[i].information.split(',');
          i = response.body.length;
        }
      }
    });
    this.el = document.querySelector("#home_title_box");
    this.update_title();
  }

  ngOnDestroy() {
    this.resize_ob.unobserve(this.el);
  }
}
