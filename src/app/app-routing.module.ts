import { Page403Component } from '@@pages/errors/page403/page403.component';
import { Page404Component } from '@@pages/errors/page404/page404.component';
import { Page500Component } from '@@pages/errors/page500/page500.component';
import { IndexComponent } from '@@pages/index/index.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
	{ path: '', component: IndexComponent },
	{ path: 'home', redirectTo: '/', pathMatch: 'full' },
	{ path: 'work', loadChildren: () => import('@@pages/work/work.module').then(m => m.WorkModule) },
	{ path: 'about', loadChildren: () => import('@@pages/about/about.module').then(m => m.AboutModule) },
	{ path: 'contact', loadChildren: () => import('@@pages/contact/contact.module').then(m => m.ContactModule) },
	{ path: 'login', loadChildren: () => import('@@pages/login/login.module').then(m => m.LoginModule) },
	{ path: 'admin', loadChildren: () => import('@@pages/admin/admin.module').then(m => m.AdminModule) },
	{ path: 'error403', component: Page403Component },
	{ path: 'error500', component: Page500Component },
	{ path: 'not-found', component: Page404Component },
	{ path: '**', redirectTo: 'not-found' }
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }