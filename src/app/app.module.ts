import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import {BluetoothSerial} from '@ionic-native/bluetooth-serial/ngx';
import { BluetoothLE } from '@ionic-native/bluetooth-le/ngx';
import { BLE } from '@ionic-native/ble/ngx';
import { Printer, PrintOptions } from '@ionic-native/printer/ngx';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,HttpClientModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, BluetoothSerial, BluetoothLE, BLE, Printer],
  bootstrap: [AppComponent],
})
export class AppModule {}
