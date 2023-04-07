import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-work',
  templateUrl: './admin-work.component.html',
  styleUrls: ['./admin-work.component.scss']
})
export class AdminWorkComponent implements OnInit {

  constructor(){ }

  current_value: string = "add";
  show_add: boolean = true;
  show_edit: boolean = false;
  show_delete: boolean = false;

  method_change(event: any): void {
    const value = event.target.value;
    if(value !== this.current_value){
      if(value === "add"){
        this.show_edit = false;
        this.show_delete = false;
        this.show_add = true;
        this.current_value = "add";
      }
      else if(value === "edit"){
        this.show_add = false;
        this.show_delete = false;
        this.show_edit = true;
        this.current_value = "edit";
      }
      else if(value === "delete"){
        this.show_add = false;
        this.show_edit = false;
        this.show_delete = true;
        this.current_value = "delete";
      }
    }
  }


  ngOnInit(): void { }
  /*
    this.informationService.getInformationTable()
    .subscribe((response: any) => {
      for(let i: number = 0; i < response.body.length; i++){
        if(response.body[i].name === "index_titles" && response.body[i].information){
          this.home_titles = response.body[i].information;
          this.index_titles_id = i + 1;
          i = response.body.length;
        }
      }
    });
  }
  */




}
