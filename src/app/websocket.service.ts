import { Injectable } from "@angular/core";
import { Subject, Observable, Observer } from "rxjs/Rx";

@Injectable()
export class WebsocketService {
  constructor() {}

  private stockSubject: Subject<any>;

  public connect(url): Subject<any> {
    if (!this.stockSubject) {
      this.stockSubject = this.create(url);
    }
    return this.stockSubject;
  }

  private create(url): Subject<any> {
    let ws = new WebSocket(url);

    let observable = Observable.create((obs: Observer<any>) => {
      ws.onmessage = obs.next.bind(obs);
      ws.onerror = obs.error.bind(obs);
      ws.onclose = obs.complete.bind(obs);
      return ws.close.bind(ws);
    });
    let observer = {
      next: (data: Object) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify(data));
        }
      }
    };
    return Subject.create(observer, observable);
  }
}