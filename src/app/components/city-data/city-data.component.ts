import { Component, Input } from '@angular/core';

import { IMeasurement } from '../../interfaces';
import { NO_DATA } from '../../constants';

@Component({
  selector: 'app-city-data',
  templateUrl: './city-data.component.html',
  styleUrls: ['./city-data.component.scss']
})
export class CityDataComponent {
  @Input() public measurement: IMeasurement;

  public noData = NO_DATA;
}
