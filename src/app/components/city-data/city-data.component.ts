import { Component, OnInit, Input } from '@angular/core';

import { ICity, IMeasurement } from 'src/app/interfaces/interfaces';

@Component({
  selector: 'app-city-data',
  templateUrl: './city-data.component.html',
  styleUrls: ['./city-data.component.scss']
})
export class CityDataComponent implements OnInit {
  @Input() public measurement: IMeasurement;

  constructor() { }

  public ngOnInit() {
    // console.log('City: ', this.measurement.city);
  }

}
