import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { CookieService } from 'ngx-cookie-service';
import { InformationService } from '../../../rest/information.service';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.scss']
})
export class AdminHomeComponent implements OnInit{

  constructor(private router: Router, private cookieService: CookieService, private informationService: InformationService) { }

  home_titles: string | undefined = undefined;
  error_message: string | undefined = undefined;
  index_titles_id: number = 0;

  update(titles: string): void {
    if(this.home_titles !== titles){
      if(!this.cookieService.get('JWT')){
        this.router.navigate(['login']);
      }
      else{
        const cookieValue: string = this.cookieService.get('JWT');
        this.informationService.editInformationTable(cookieValue, this.index_titles_id, "index_titles", titles)
        .subscribe((response: any): void  => {
          if(response === "0"){
            this.router.navigate(['login']);
          }
          else {
            this.router.navigate(['home']);
            this.error_message = undefined;
          }
        });
      }
    }
    else{
      this.error_message = "Information not edited";
    }
  }

  ngOnInit(): void {
    this.informationService.getInformationTable()
    .subscribe((response: any): void  => {
      for(let i: number = 0; i < response.body.length; i++){
        if(response.body[i].name === "index_titles" && response.body[i].information){
          this.home_titles = response.body[i].information;
          this.index_titles_id = i + 1;
          break;
        }
      }
    });
  }

}
