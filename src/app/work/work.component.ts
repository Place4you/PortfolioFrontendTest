import { Component } from '@angular/core';
import { WorkService } from '../rest/work.service';

@Component({
  selector: 'app-work',
  templateUrl: './work.component.html',
  styleUrls: ['./work.component.scss']
})
export class WorkComponent {
  
  constructor(private workService: WorkService){ }
  

  array_all:            Array<{ page: any }> = [];
  array_page:           Array<{ id: number, name: string, code_uri: string, live_uri: string, image_uri: string, image_alt: string, date: Date, description: string }> = [];
  pageIndex:            number = 0;
  total_pages:          number = 1;
  show_arrows:          boolean = false;
  project_items:        Array<{ id: number, name: string, code_uri: string, live_uri: string, image_uri: string, image_alt: string, date: Date, description: string }> = [];
  page_selector_items:  Array<{ number: number }> = [{ number: 1 }];

  onRightArrow(){
    this.pageIndex++;
    if(this.pageIndex > this.total_pages - 1){
      this.pageIndex = 0;
    }
    const item = document.getElementById(`${this.pageIndex + 1}`) as HTMLInputElement;
    if(item){
      item.checked = true;
      const horizontal_bar = document.getElementById("page_selector");
      if(horizontal_bar !== null){
        const bar_position: number = (this.pageIndex === 0) ? 0 : this.pageIndex / (this.total_pages - 1);
        horizontal_bar.scrollLeft = bar_position * 100;
      }
    }
  }
  onLeftArrow(){
    this.pageIndex--;
    if(this.pageIndex < 0){
      this.pageIndex = this.total_pages - 1;
    }
    const item = document.getElementById(`${this.pageIndex + 1}`) as HTMLInputElement;
    if(item){
      item.checked = true;
      const horizontal_bar = document.getElementById("page_selector");
      if(horizontal_bar !== null){
        const bar_position: number = (this.pageIndex === this.total_pages) ? 0 : this.pageIndex / (this.total_pages - 1);
        horizontal_bar.scrollLeft = bar_position * 100;
      }
    }
  }

  changePage(page_number: number){
    this.pageIndex = page_number - 1;
  }

  ngOnInit(){

    this.workService.getItems()
    .subscribe((response: any) => {
      for(let i: number = 0; i < response.body.length; i++){
        if(response.body[i]){
          this.project_items.push(response.body[i]);
        }
      }

      let start_at: number = 0;
      for(let i: number = start_at; i < this.project_items.length; i++){
        if(i%2 === 0 && i%3 === 0 && i !== start_at){
          if(!this.show_arrows){
            this.show_arrows = true;
          }

          this.page_selector_items.push({
            number: this.total_pages + 1
          });          

          this.total_pages++;
          this.array_all.push({page: this.array_page});
          this.array_page = [];
          this.array_page.push({
            id: this.project_items[i].id,
            name: this.project_items[i].name,
            code_uri: this.project_items[i].code_uri,
            live_uri: this.project_items[i].live_uri,
            image_uri: this.project_items[i].image_uri,
            image_alt: this.project_items[i].image_alt,
            date: this.project_items[i].date,
            description: this.project_items[i].description
          });
          start_at = i;
        }
        else{
          this.array_page.push({
            id: this.project_items[i].id,
            name: this.project_items[i].name,
            code_uri: this.project_items[i].code_uri,
            live_uri: this.project_items[i].live_uri,
            image_uri: this.project_items[i].image_uri,
            image_alt: this.project_items[i].image_alt,
            date: this.project_items[i].date,
            description: this.project_items[i].description
          });
          if(i === this.project_items.length - 1){
            this.array_all.push({page: this.array_page});
            this.array_page = [];
          }
        }
      }
    });
  }
}
