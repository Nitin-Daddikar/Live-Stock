import { Component } from '@angular/core';
import * as moment from 'moment';

import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  //list of stocks; default no stocks
  stocksList = [];

  constructor(appService: AppService) {

    //observable to handle websocket response
    appService.stocks.subscribe(updatedStockList => {
        this.updateStocks(updatedStockList)
    });
  }

  updateStocks(updatedStockList){
    updatedStockList.forEach(newStock => {

      //getting index of new stock
      var index = this.stocksList.findIndex(function(stock) {
        return stock.name == newStock[0]
      });

      //converting array to object
      let stockObject : any = this.convertArrayToObejct(newStock);

      //pushing current timestamp as its got updated now
      stockObject["timestamp"] = moment().valueOf();

      if(index == -1){ //new stock is not is not present in current stock list

        //default difference is zero
        stockObject["diff"] = 0;
        //to maintain status
        stockObject["status"] = null;

        //generate data for chart
        stockObject = this.generateObjectForChart(stockObject,stockObject);

        //adding new stock in stock list
        this.stocksList.push(stockObject)
      }else{ //new stock is not is already present in current stock list

        //get differnce from old value
        stockObject["diff"] = this.getDiffernceOfStock(this.stocksList[index], newStock);

        //check if price is rising or not
        stockObject["status"] = this.getStatusOfStock(this.stocksList[index], newStock);

        //generate data for chart
        stockObject = this.generateObjectForChart(this.stocksList[index],stockObject);

        this.stocksList[index] = stockObject;
      }
    });
  }

  //returns if price is rising or not
  getStatusOfStock(oldStock, newStock){
    return oldStock.price < newStock[1];
  }

  //return absoulte diff between old and new stock value
  getDiffernceOfStock(oldStock, newStock){
    return Math.abs(oldStock.price - newStock[1]).toFixed(2);
  }

  //return last update time in text
  getTimeStringFromTimestamp(stock){
    return moment(stock.timestamp).toNow(true) + " ago";
  }

  //converts array to JSON object
  convertArrayToObejct(stock){
    return {
      name : stock[0],
      price : stock[1].toFixed(2),
    }
  }

  //generated charts series and value
  generateObjectForChart(oldStock,newStock){
    let chartData = oldStock.chartData;
    if(chartData === undefined){ // new stock
      //creating object for chart of new tock
      oldStock.chartData =[
        {
          "name": oldStock.name,
          "series": [
            {
              "name": "0",
              "value": newStock.price
            }
          ]
        }
      ]
    }else{

      //to maintain grpah points upto 10
      if(oldStock.chartData[0].series.length == 10){
        oldStock.chartData[0].series.shift(); //removes first element ie oldest point
      }
      oldStock.chartData[0].series.push({
        "name": (Math.floor((Math.random() * 100) + 1))+"",
        "value": newStock.price
      })
    }
    newStock.chartData = oldStock.chartData;
    return newStock;
  }
}
