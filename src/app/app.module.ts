import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';

import { AppService } from './app.service';
import { WebsocketService } from './websocket.service';

@NgModule({
  imports: [
    BrowserModule,
    NgxChartsModule,
    BrowserAnimationsModule
  ],
  declarations: [
    AppComponent
  ],
  providers: [
    AppService,
    WebsocketService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
