import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from '@@shared/navbar/navbar.component';
import { IndexComponent } from '@@pages/index/index.component';
import { WorkComponent } from '@@pages/work/work.component';
import { AboutComponent } from '@@pages/about/about.component';
import { ContactComponent } from '@@pages/contact/contact.component';
import { LoginComponent } from '@@pages/login/login.component';
import { AdminComponent } from '@@pages/admin/admin.component';
import { AdminHomeComponent } from '@@pages/admin/views/admin-home/admin-home.component';
import { AdminWorkComponent } from '@@pages/admin/views/admin-work/admin-work.component';
import { AdminAboutComponent } from '@@pages/admin/views/admin-about/admin-about.component';
import { AdminContactComponent } from '@@pages/admin/views/admin-contact/admin-contact.component';
import { AdminUserComponent } from '@@pages/admin/views/admin-user/admin-user.component';
import { HttpErrorInterceptor } from './interceptors/error-and-cache.interceptor';
import { LoaderInterceptor } from './interceptors/loader.interceptor';
import { LoaderComponent } from '@@shared/loader/loader.component';

@NgModule({
	declarations: [
		AppComponent,
		NavbarComponent,
		IndexComponent,
		WorkComponent,
		AboutComponent,
		ContactComponent,
		LoginComponent,
		AdminComponent,
		AdminHomeComponent,
		AdminWorkComponent,
		AdminAboutComponent,
		AdminContactComponent,
		AdminUserComponent,
		LoaderComponent
	],
	imports: [
		BrowserModule,
		HttpClientModule,
		AppRoutingModule
	],
	providers: [
		{
			provide: HTTP_INTERCEPTORS,
			useClass: HttpErrorInterceptor,
			multi: true
		},
		{
			provide: HTTP_INTERCEPTORS,
			useClass: LoaderInterceptor,
			multi: true
		}
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
