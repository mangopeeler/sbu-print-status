import _ from 'lodash';

export class Printer {

  constructor(name, url, index, supplyThreshold){
    this.name = name;
    this.index = index;
    this.url = url;
    this.supplyThreshold = supplyThreshold;

    this.tonerStatus = 'Unknown';
    this.drumStatus = 'Unknown';
    this.maintKitStatus = 'Unknown';
    this.statusMessage = 'Offline';

    this.printerStatus = 3;
    this.printerType = 0; // 0: Print from Anywhere, 1: RCC Lab

    this.trays = [];

  }

  tonerStatusCode(){
    let status = 0;

    const tonerStatus = this.tonerStatus;

    if(tonerStatus == 'Replace') { status = 2 }
    else{
      let pages = parseInt(tonerStatus.substring(0, tonerStatus.indexOf('-')))
  
      if(pages < this.supplyThreshold) {status = 1 }
    }

    return status;
  }

  drumStatusCode(){

    let status = 0;

    const drumStatus = this.drumStatus;

    if(drumStatus == 'Replace') { status = 2 }
    else{
      let pages = parseInt(drumStatus.substring(0, drumStatus.indexOf('-')))
  
      if(pages < this.supplyThreshold) {status = 1 }
    }

    return status;
    
  }

  maintKitStatusCode(){

    let status = 0;

    const maintKitStatus = this.maintKitStatus;

    if(maintKitStatus == 'Replace') { status = 2 }
    else{
      let pages = parseInt(maintKitStatus)
  
      if(pages < this.supplyThreshold) {status = 1 }
    }

    return status;

  }

  /**
   * Parses the json that is passed in and returns a new printer with the data.
   * @param {*} printerJSON JSON object with the printer data.
   * @param {*} printerName Name of the printer.
   * @param {*} printerIndex The index of the printer.
   * @param {*} printerUrl The url of the printer's web server.
   * @returns {Printer} A new printer object.
   */
  static ParsePrinterJSON(printerJSON, printerName, printerUrl, printerIndex, supplyThreshold) {

    let printer = new Printer(printerName, printerUrl, printerIndex, supplyThreshold);

    const traysJSON = printerJSON.Trays;

    // Parse printer trays.
    traysJSON.forEach(tray => {

      // Create a new tray.
      let newTray = new Tray(tray.TrayName, tray.TrayStatus, tray.TraySetting);

      // Add Tray to the newly created printer object.
      printer.trays.push(newTray);

    });

    // Set supply status.
    printer.tonerStatus = printerJSON.TonerStatus;
    printer.drumStatus = printerJSON.DrumStatus;
    printer.maintKitStatus = printerJSON.MaintKitStatus;

    // Set main printer status.
    printer.printerStatus = printerJSON.CurrentStatus;

    // Set printer status message.
    printer.statusMessage = printerJSON.StatusMessage;

    // Set printer type.
    printer.printerType = printerJSON.Type;

    return printer;
  }

  /**
   * Generate a printer with a random status.
   * @param {*} printerName 
   * @param {*} printerUrl 
   * @param {*} printerIndex 
   * @param {*} supplyThreshold 
   */
  static GenerateRandomPrinter(printerName, printerUrl, printerIndex, supplyThreshold){

    // Create a printer.
    let printer = new Printer(printerName, printerUrl, printerIndex, supplyThreshold);
    printer.printerStatus = 0;

    // Number of random trays to generate.
    let traysGenerated = 4;
    let emptyGenerated = 0;
    let fullGenerated = 0;

    // Start generating random trays.
    for (let index = 0; index < traysGenerated; index++) {

      // Random int generator. (Between 1-100)
      const rng = _.random(1, 100);
      
      // Generates an empty tray depending on whether the rng value is less than...
      if(rng <= 5 * (traysGenerated - index)){
        printer.trays.push(new Tray(`Tray ${index + 1}`, 2, 'Letter'));
        emptyGenerated++;
      }
      else {
        printer.trays.push(new Tray(`Tray ${index +1}`, 0, 'Letter'));
        fullGenerated++;
      }

    }

    if(fullGenerated > 1){
      printer.printerStatus = 0;
    }
    else if(fullGenerated === 1){
      printer.printerStatus = 1;
    }
    else {
      printer.printerStatus = 2;
    }

    // Generate random toner value.
    let rng = _.random(1, 100);

    // Toner should be under threshold.
    if(rng < 10 && rng > 5){
      let tonerCount = _.random(100, supplyThreshold - 1);
      printer.tonerStatus = `${tonerCount - 50}-${tonerCount} Pages Remaining` 
    }
    // Toner should be replaced
    else if(rng < 5){
      printer.tonerStatus = "Replace";
    }
    // Toner has some random value.
    else {
      let tonerCount = _.random(supplyThreshold + 1, 12000);
      printer.tonerStatus = `${tonerCount - 50}-${tonerCount} Pages Remaining`;
    }

    // Generate random drum kit value.
    printer.drumStatus = "21000-22312 Pages Remaining";
    printer.maintKitStatus = "100003-101042 Pages Remaining";
    printer.printerStatus = (printer.tonerStatusCode() >= printer.printerStatus) ? printer.tonerStatusCode() : printer.printerStatus;
    printer.statusMessage = 'Test Data...'
    return printer;

  }

}

export class Tray {

  constructor(name, statusCode, setting){
    this.name = name;
    this.statusCode = statusCode;
    this.setting = setting;
  }

  trayStatus(){

    switch(this.statusCode){
      case 0: return 'Full';
      case 1: return 'Low';
      case 2: return 'Empty';
    }

  }

}