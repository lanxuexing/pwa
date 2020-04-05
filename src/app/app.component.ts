import { Component, OnInit } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { SwUpdatesService } from './sw-updates.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'pwa';

  constructor(
    private swPush: SwPush,
    private swUpdates: SwUpdatesService
  ) {
    this.swPush.notificationClicks.subscribe(event => {
      console.log('消息推送: ', event);
      const url = event.notification.data.url;
      window.open(url, '_blank');
    });

  }

  ngOnInit(): void {
    this.swUpdates.updateActivated.subscribe(_ => {
      if (confirm('检测到版本更新，是否更新到最新版本？(╯#-_-)╯~~')) {
        window.location.reload();
      }
    });
  }

}
