import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import {NgxLocalStorageModule} from 'ngx-localstorage';
import { ToastrModule } from 'ngx-toastr';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';

import { PriceService } from './services/price.service';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule, // required animations module
    FormsModule,
    HttpClientModule,
    NgxLocalStorageModule.forRoot(),
    ToastrModule.forRoot(), // ToastrModule added
    AppRoutingModule
  ],
  providers: [PriceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
