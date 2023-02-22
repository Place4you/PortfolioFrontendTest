import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { IndexComponent } from './index/index.component';
import { WorkComponent } from './work/work.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { LoginComponent } from './login/login.component';
import { AdminComponent } from './admin/admin.component';
import { Page404Component } from './errors/page404/page404.component';

const routes: Routes = [
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'home', component:IndexComponent},
  {path: 'work', component:WorkComponent},
  {path: 'about', component:AboutComponent},
  {path: 'contact', component:ContactComponent},
  {path: 'login', component:LoginComponent},
  {path: 'admin', component:AdminComponent},
  {path: '**', component:Page404Component}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
