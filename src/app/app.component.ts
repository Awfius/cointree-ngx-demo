import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { IntervalObservable } from 'rxjs/observable/IntervalObservable';

import {LocalStorageService} from 'ngx-localstorage';

import { PriceService } from './services/price.service';

import { PriceViewModel } from './view-models/price.view-model';

import { Price } from './models/price';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {

  priceViewModel: PriceViewModel;
  currentPrice: Price;

  constructor (
    private storageService: LocalStorageService,
    private priceService: PriceService) {

      this.priceViewModel = new PriceViewModel();
  }

  ngOnInit() {

    this.getPrices();
    IntervalObservable.create(30000).subscribe(x => {
      this.priceViewModel.askPercentClass = "";
      this.priceViewModel.bidPercentClass = "";
      this.priceViewModel.spotPercentClass = "";
      this.getPrices();
    });  

  }

  getPrices() {
    let prices = new Array<Price>();
    let currentPrice = new Price();
    let pricesString = this.storageService.get('prices');

    this.priceService.getPrices()
      .subscribe(data => {
        currentPrice = data;
        this.priceViewModel.ask = currentPrice.ask;
        this.priceViewModel.bid = currentPrice.bid;
        this.priceViewModel.spot = currentPrice.spot;
        this.priceViewModel.askPercent = 0;
        this.priceViewModel.bidPercent = 0;
        this.priceViewModel.spotPercent = 0;
        if (pricesString == null) {
          prices.push(data);
        }
        else {
          prices = JSON.parse(pricesString);
          let previousPrice = prices[prices.length - 1];
          if (JSON.stringify(previousPrice) !== JSON.stringify(currentPrice)) {
            prices.push(data);
          }
          console.log(previousPrice);
          console.log(currentPrice);
          this.priceViewModel.askPercent = this.calulatePercentage(previousPrice.ask, currentPrice.ask);
          this.priceViewModel.bidPercent = this.calulatePercentage(previousPrice.bid, currentPrice.bid);
          this.priceViewModel.spotPercent = this.calulatePercentage(previousPrice.spot, currentPrice.spot);

          this.priceViewModel.askPercentClass = this.priceViewModel.askPercent <= 0 ? "animated fadeInDown" : "animated fadeInUp";
          this.priceViewModel.bidPercentClass = this.priceViewModel.bidPercent <= 0 ? "animated fadeInDown" : "animated fadeInUp";
          this.priceViewModel.spotPercentClass = this.priceViewModel.spotPercent <= 0 ? "animated fadeInDown" : "animated fadeInUp";
          console.log(this.priceViewModel);
        }
        this.storageService.set('prices', JSON.stringify(prices));
      });
  }

  calulatePercentage (previousPrice, currentPrice) {
    return (100 - ((previousPrice / currentPrice) * 100));
  }
}
