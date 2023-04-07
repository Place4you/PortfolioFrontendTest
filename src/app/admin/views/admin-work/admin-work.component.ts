import { Component, OnInit, AfterViewInit } from '@angular/core';
import { WorkService } from '../../../rest/work.service';
import { Router } from '@angular/router'
import { CookieService } from 'ngx-cookie-service';


@Component({
  selector: 'app-admin-work',
  templateUrl: './admin-work.component.html',
  styleUrls: ['./admin-work.component.scss']
})
export class AdminWorkComponent implements OnInit,AfterViewInit {

  constructor(private router: Router, private cookieService: CookieService, private workService: WorkService) { }

  error_message: string = "";
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


  create_item(
    name: string,
    date: string,
    technologies: string,
    description: string,
    code_uri: string,
    live_uri: string,
    image_uri: string,
    image_alt: string
  ): void {

    if(!name){
      this.error_message = "Field <name> can't be null";
    }
    else if(!date){
      this.error_message = "Field <date> can't be null";
    }
    else if(!technologies){
      this.error_message = "Field <technologies> can't be null";
    }
    else if(!description){
      this.error_message = "Field <description> can't be null";
    }

    else {
      if(!this.cookieService.get('JWT')){
        this.router.navigate(['login']);
      }
      else{
        const cookieValue: string = this.cookieService.get('JWT');
        this.workService.createItem(cookieValue, name, date, technologies, description, code_uri, live_uri, image_uri, image_alt)
        .subscribe((response: any) => {
          if(response === "0"){
            this.router.navigate(['login']);
          }
          else {
            this.router.navigate(['home']);
            this.error_message = "";
          }
        });
      }
    }
  }



  ngOnInit(): void { }

  ngAfterViewInit(): void {
    const date_input = document.getElementById("date_add") as HTMLInputElement;
    if(date_input !== null){
      date_input.max = new Date().toLocaleDateString('fr-ca');
      date_input.value = new Date().toLocaleDateString('fr-ca');
    }
  }


}
