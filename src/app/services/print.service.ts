import { Injectable, NgZone } from '@angular/core';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { BluetoothLE } from '@ionic-native/bluetooth-le/ngx';
import { BLE } from '@ionic-native/ble/ngx';
import { Platform } from '@ionic/angular';

declare var BrowserPrint: any;

@Injectable({
  providedIn: 'root'
})
export class PrintService {

  selected_device;
  public devices = [];

  constructor(private btSerial: BluetoothSerial,
    private ble: BLE,
    private ngZone: NgZone,
    public bluetoothle: BluetoothLE, 
    public plt: Platform) { }

  scanBLE(){
    this.devices = [];
    this.ble.scan([],15).subscribe(device=>this.onDeviceFound(device));
  }

  onDeviceFound(device){
    console.log("BLE Discovered"+ JSON.stringify(device,null,2));
    this.ngZone.run(()=>{
      this.devices.push(device);
      console.log("BLE Found",device);
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
