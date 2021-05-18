// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  metadata : 'com.ns.im.MatMobility/sap/opu/odata/SAP/ZMIM_GR_APP_SRV/$metadata?X-SMP-APPID=com.ns.im.MatMobility',
  //baseURL: 'https://mobile-d0c004beb.us2.hana.ondemand.com/',
  baseURL: 'https://hd3ci.atldc.nscorp.com:8665/',
  labelURL: `sap/opu/odata/SAP/ZMIM_GR_APP_SRV/PDFLabelSet(Mblnr=%275000005154%27,Mjahr=%272020%27,Mblpo=%270001%27)/$value?&filter(Printer eq 'A')`
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
