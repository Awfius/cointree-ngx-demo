import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import {NgxLocalStorageModule} from 'ngx-localstorage';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';

import { PriceService } from './services/price.service';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    NgxLocalStorageModule.forRoot(),
    AppRoutingModule
  ],
  providers: [PriceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
