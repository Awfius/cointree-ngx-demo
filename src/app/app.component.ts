import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { IntervalObservable } from 'rxjs/observable/IntervalObservable';

import { LocalStorageService } from 'ngx-localstorage';
import { ToastrService } from 'ngx-toastr';

import { PriceService } from './services/price.service';

import { PriceViewModel } from './view-models/price.view-model';

import { Price } from './models/price';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {

  inputPrice: number;
  priceViewModel: PriceViewModel;
  currentPrice: Price;

  constructor (
    private storageService: LocalStorageService,
    private toastrService: ToastrService,
    private priceService: PriceService) {

      this.priceViewModel = new PriceViewModel();
      this.priceViewModel.ask = 0;
      this.priceViewModel.bid = 0;
      this.priceViewModel.spot = 0;
      this.priceViewModel.askPercent = 0;
      this.priceViewModel.bidPercent = 0;
      this.priceViewModel.spotPercent = 0;
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
          
          this.priceViewModel.askPercent = this.calulatePercentage(previousPrice.ask, currentPrice.ask);
          this.priceViewModel.bidPercent = this.calulatePercentage(previousPrice.bid, currentPrice.bid);
          this.priceViewModel.spotPercent = this.calulatePercentage(previousPrice.spot, currentPrice.spot);

          this.priceViewModel.askPercentClass = this.priceViewModel.askPercent == 0 ? "animated shake" : this.priceViewModel.askPercent > 0 ? "animated fadeInUp" : "animated fadeInDown";
          this.priceViewModel.bidPercentClass = this.priceViewModel.bidPercent == 0 ? "animated shake" : this.priceViewModel.bidPercent > 0 ? "animated fadeInUp" : "animated fadeInDown";
          this.priceViewModel.spotPercentClass = this.priceViewModel.spotPercent == 0 ? "animated shake" : this.priceViewModel.spotPercent > 0 ? "animated fadeInUp" : "animated fadeInDown";
          
          if (this.priceViewModel.ask > this.inputPrice) {
            this.toastrService.info('Notification', 'Buying price is higher!');
          }
          if (this.priceViewModel.bid > this.inputPrice) {
            this.toastrService.info('Notification', 'Selling price is higher!');
          }
          if (this.priceViewModel.spot > this.inputPrice) {
            this.toastrService.info('Notification', 'Spot price is higher!');
          }
        }
        this.storageService.set('prices', JSON.stringify(prices));
      });
  }

  calulatePercentage (previousPrice, currentPrice) {
    return (100 - ((previousPrice / currentPrice) * 100));
  }
}
