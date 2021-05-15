import { Component } from '@angular/core';
import { PrintService } from '../services/print.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  bluetoothList:any=[];
  selectedPrinter:any;

  constructor(private print: PrintService) {
    //this.print.checkBLE();
    //this.print.setupBrowsePrint();
    //this.listPrinter();
  }

  async scanDevice(){
    await this.print.scanBLE();
    this.bluetoothList = this.print.devices;
  }

  scanLocalDevice(){
    this.print.findLocalDevices();
  }

  scanDefaultPrinter(){
    this.print.setupBrowsePrint();
  }

  getDevice(){
    console.log(" this.bluetoothList = this.print.devices;",this.print.devices);
    this.bluetoothList = this.print.devices;
  }

  //This will list all of your bluetooth devices
  listPrinter() { 
    this.print.searchBluetoothPrinter()
      .then(resp=>{
      //List of bluetooth device list
      console.log("Bluetooth found:",resp);
      this.bluetoothList=resp;
    });
  }

  //This will store selected bluetooth device mac address
  selectPrinter(device)
  {
    //Selected printer macAddress stored here
    console.debug(`selectPrinter()`,device);
    this.selectedPrinter=device;
  }

  //This will print
  printStuff()
  {  
    //The text that you want to print
    var myText="Hello hello hello \n\n\n This is a test \n\n\n";
    this.print.sendToBluetoothPrinter(this.selectedPrinter,myText);
  }

}
