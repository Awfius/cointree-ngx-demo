import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { hosts } from '../hosts';

import { Price } from '../models/price';

@Injectable()
export class PriceService {

  constructor(private http: HttpClient) {
  }

  getPrices() {
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Content-Type', 'application/json');
    return this.http.get<Price>(`${hosts.PRICES_API}/v1/price/btc/aud`, {headers});
  }
}
