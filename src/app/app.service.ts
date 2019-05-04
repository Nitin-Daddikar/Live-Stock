import { Injectable } from "@angular/core";
import { Subject } from "rxjs/Rx";

import { WebsocketService } from "./websocket.service";

const CHAT_URL = "ws://stocks.mnet.website";

@Injectable()
export class AppService {
  public stocks: Subject<any>;

  constructor(wsService: WebsocketService) {
    this.stocks = <Subject<any>>wsService.connect(CHAT_URL).map(
      (response: any): any => {
        return JSON.parse(response.data);
      }
    );
  }
}