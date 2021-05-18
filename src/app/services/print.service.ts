import { Injectable, NgZone } from '@angular/core';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { BluetoothLE } from '@ionic-native/bluetooth-le/ngx';
import { BLE } from '@ionic-native/ble/ngx';
import { Platform, ToastController } from '@ionic/angular';

import { HttpClient, HttpHeaders } from  '@angular/common/http';

import { environment } from 'src/environments/environment';


declare var BrowserPrint: any;

@Injectable({
  providedIn: 'root'
})
export class PrintService {

  printUrl = environment.baseURL;
  
  selected_device;
  public devices = [];

  constructor(
    private  httpClient : HttpClient,
    private toast: ToastController,
    private btSerial: BluetoothSerial,
    private ble: BLE,
    private ngZone: NgZone,
    public bluetoothle: BluetoothLE, 
    public plt: Platform) { }


    async popError(message){
      const toast = await this.toast.create({
        message: message,
        header: 'NS Warning!',
        duration: 3000,
        color: 'danger',
        position: 'middle',
        buttons: [
          {
            side: 'end',
            icon: 'alert-circle-outline',
            text: 'SYSTEM ALERT',
            handler: () => {
              console.log('Cart Button Clicked');
            }
          }, {
            side: 'end',
            text: 'Close',
            role: 'cancel',
            handler: () => {
              console.log('Close clicked');
            }
          }
        ]
        
      });
      await toast.present();
      await await toast.onDidDismiss();
    }

    getMetadata(){
      let url = this.printUrl +  environment.metadata;
      return  this.httpClient.get(url, {
        headers: new HttpHeaders({
          'Content-Type':  'application/xml',
          'X-CSRF-Token': 'fetch',
          'X-SMP-APPCID': 'e86e3ab4-3b87-4364-a503-f785a0787bdf'
          }),
        responseType: 'text',
        observe: 'response' as 'response',
        withCredentials:true
      }).toPromise();
    }

  
  getLabel(){
    // let url1 = this.printUrl + `sap/opu/odata/SAP/ZMIM_GR_APP_SRV/PDFLabelSet(Mblnr=%275000005154%27,Mjahr=%272020%27,Mblpo=%270001%27)/$value?&filter(Printer eq 'A')`;
    // let url2 = this.printUrl + `sap/opu/odata/sap/ZMIM_GR_APP_SRV/PDFLabelSet(Mblnr=%275000003041%27,Mjahr=%272019%27,Mblpo=%270001%27)/$value?&filter(Printer eq 'A')`;
    
    let url = this.printUrl +  environment.labelURL;
    let options = {
      headers: new HttpHeaders({
        'Content-Type':  'application/xml',
      }),
      withCredentials:true
    };
    return this.httpClient.get(url,options).toPromise();
  }
  scanBLE(){
    this.devices = [];
    this.ble.scan([],15).subscribe(device=>this.onDeviceFound(device));
  }

  onDeviceFound(device){
    console.log("BLE Discovered"+ JSON.stringify(device,null,2));
    this.ngZone.run(()=>{
      this.devices.push(device);
      console.log("BLE Found",device);
          // on iOS, print the manufacturer data if it exists
        if (device.advertising && device.advertising.kCBAdvDataManufacturerData) {
          const mfgData = new Uint8Array(device.advertising.kCBAdvDataManufacturerData);
          console.log('Manufacturer Data is', mfgData);
        }
    })

  }

  findLocalDevices(){
    BrowserPrint.getLocalDevices(list=>{
      console.log("findLocalDevices Found",list);
    });
  }


setupBrowsePrint(){
  console.debug("setupBrowsePrint");
  BrowserPrint.getDefaultDevice("printer",device=>{
    console.debug("FOUND BrowserPrint.getDefaultDevice:",device);

  },(err)=>console.error("ERROR: BrowserPrint.getDefaultDevice",err));



	//Get the default device from the application as a first step. Discovery takes longer to complete.
	// BrowserPrint.getDefaultDevice("printer", function(device){
		
	// 			//Add device to list of devices and to html select element
	// 			this.selected_device = device;
	// 			this.devices.push(device);
	// 			var html_select = document.getElementById("selected_device");
	// 			var option = document.createElement("option");
	// 			option.text = device.name;
	// 			//html_select.add(option);
				
	// 			//Discover any other devices available to the application
	// 			BrowserPrint.getLocalDevices(function(device_list){
	// 				for(var i = 0; i < device_list.length; i++)
	// 				{
	// 					//Add device to list of devices and to html select element
	// 					var device = device_list[i];
	// 					if(!this.selected_device || device.uid != this.selected_device.uid)
	// 					{
	// 						this.devices.push(device);
	// 						var option = document.createElement("option");
	// 						option.text = device.name;
	// 						option.value = device.uid;
	// 						//html_select.add(option);
	// 					}
	// 				}
					
	// 			}, function(){alert("Error getting local devices")},"printer");
				
	// 		}, function(error){
  //       let message = "ERROR with BrowsePrint" + error;
  //       console.error("ERROR: 	BrowserPrint.getDefaultDevice",error);
	// 			alert(message);
	// 		})
}

  checkBLE(){
    this.plt.ready().then((readySource) => {
      console.log('Platform ready from', readySource);
      this.bluetoothle.initialize().subscribe(ble => {
        console.log('ble', ble.status) // logs 'enabled'
      },err=>console.error("ERROR: BLUETOOTH LE",err));
   
     });
  }
  

  searchBluetoothPrinter(){
    //This will return a list of bluetooth devices
    return this.btSerial.list(); 
  }

  connectToBluetoothPrinter(macAddress){
    //This will connect to bluetooth printer via the mac address provided
    return this.btSerial.connect(macAddress)
  }

  disconnectBluetoothPrinter(){
    //This will disconnect the current bluetooth connection
    return this.btSerial.disconnect();
  }

  /************************************************
   * macAddress->the device's mac address 
   * data_string-> string to be printer
   ************************************************/
  sendToBluetoothPrinter(macAddress,data_string){
    //1. Try connecting to bluetooth printer
    this.connectToBluetoothPrinter(macAddress)
    .subscribe(_=>{
        //2. Connected successfully
        this.btSerial.write(data_string)
        .then(_=>{
        //3. Print successful
        //If you want to tell user print is successful,
        //handle it here
        //4. IMPORTANT! Disconnect bluetooth after printing
        this.disconnectBluetoothPrinter()
        },err=>{
          //If there is an error printing to bluetooth printer
          //handle it here
        })
    },err=>{
      
      //If there is an error connecting to bluetooth printer
      //handle it here
    })
  }
}
