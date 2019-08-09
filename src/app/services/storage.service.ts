import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private itemName = 'countryCode';

  private stringifyData(data: string): string {
    return JSON.stringify(data);
  }

  private parseData(data: string): string {
    return JSON.parse(data);
  }

  public saveToLocalStorage(countryCode: string): void {
    const code = this.stringifyData(countryCode);
    localStorage.setItem(this.itemName, code);
  }

  public fetchFromLocalStorage(): string {
    const code = localStorage.getItem(this.itemName);
    return this.parseData(code);
  }

  public clearStorage(): void {
    localStorage.clear();
  }
}
