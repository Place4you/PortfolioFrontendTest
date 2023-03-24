import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  providers: [CookieService]
})
export class AdminComponent implements OnInit {

    constructor(private cookieService: CookieService, private router: Router){ }
    
    b_goto(position: string): void {

    }
    
    b_logout(): void {
        this.cookieService.delete("JWT", "/");
        this.router.navigate(['home']);
    }

    ngOnInit(): void {
        if(!this.cookieService.get('JWT')){
            this.router.navigate(['login']);
        }
        else{
            const cookieValue: string = this.cookieService.get('JWT');
        }
    }
}