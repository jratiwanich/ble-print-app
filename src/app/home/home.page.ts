import { Component } from '@angular/core';
import { PrintService } from '../services/print.service';
import { Printer, PrintOptions } from '@ionic-native/printer/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  bluetoothList:any=[];
  selectedPrinter:any;
  nToast = 0;

  constructor(private print: PrintService, private printer: Printer) {
    //this.print.checkBLE();
    //this.print.setupBrowsePrint();
    //this.listPrinter();
  }

  showToast(){
    this.print.popError(`Hello Toast ${this.nToast++}`);
  }

  printHtml() {
    this.printer.isAvailable().then((onSuccess: any) => {
    let content = document.getElementById('printer').innerHTML;
    let options: PrintOptions = {
      name: 'MyDocument',
      duplex: true,
      orientation: "portrait",
      monochrome: true
    };

    this.printer.print(content, options).then((value: any) => {
      console.log('value:', value);
    }, (error) => {
      console.log('eror:', error);
    });
    }, (err) => {
      console.log('err:', err);
    });
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
  printBluetooth()
  {  
    //The text that you want to print
    var myText="Hello hello hello \n\n\n This is a test \n\n\n";
    this.print.sendToBluetoothPrinter(this.selectedPrinter,myText);
  }

  async printLabel(){
    // let res = await this.print.getMetadata();
    // console.log("getMetadata:",res);
   let result = await this.print.getLabel();
    console.log("getLabel:",result);
  }

}
