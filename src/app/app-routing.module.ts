import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from '@@pages/index/index.component';
import { Page404Component } from '@@pages/errors/page404/page404.component';
import { Page403Component } from '@@pages/errors/page403/page403.component';
import { Page500Component } from '@@pages/errors/page500/page500.component';

const routes: Routes = [
	{ path: '', redirectTo: '/home', pathMatch: 'full' },
	{ path: 'home', component: IndexComponent },
	{ path: 'work', loadChildren: () => import('@@pages/work/work.module').then(m => m.WorkModule) },
	{ path: 'about', loadChildren: () => import('@@pages/about/about.module').then(m => m.AboutModule) },
	{ path: 'contact', loadChildren: () => import('@@pages/contact/contact.module').then(m => m.ContactModule) },
	{ path: 'login', loadChildren: () => import('@@pages/login/login.module').then(m => m.LoginModule) },
	{ path: 'admin', loadChildren: () => import('@@pages/admin/admin.module').then(m => m.AdminModule) },
	{ path: 'error403', component: Page403Component },
	{ path: 'error500', component: Page500Component },
	{ path: '**', component: Page404Component }
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }