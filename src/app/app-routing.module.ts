import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from '@@pages/index/index.component';
import { WorkComponent } from '@@pages/work/work.component';
import { AboutComponent } from '@@pages/about/about.component';
import { ContactComponent } from '@@pages/contact/contact.component';
import { LoginComponent } from '@@pages/login/login.component';
import { AdminComponent } from '@@pages/admin/admin.component';
import { Page404Component } from '@@pages/errors/page404/page404.component';
import { Page403Component } from '@@pages/errors/page403/page403.component';
import { Page500Component } from '@@pages/errors/page500/page500.component';

const routes: Routes = [
	{path: '', redirectTo: '/home', pathMatch: 'full'},
	{path: 'home', component:IndexComponent},
	{path: 'work', component:WorkComponent},
	{path: 'about', component:AboutComponent},
	{path: 'contact', component:ContactComponent},
	{path: 'login', component:LoginComponent},
	{path: 'admin', component:AdminComponent},
	{path: 'error403', component:Page403Component},
	{path: 'error500', component:Page500Component},
	{path: '**', component:Page404Component}
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
