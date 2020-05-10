import { Component, OnInit } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { SwUpdatesService } from './sw-updates.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  // readonly VAPID_PUBLIC_KEY = 'BLnVk1MBGFBW4UxL44fuoM2xxQ4o9CuxocVzKn9UVmnXZEyPCTEFjI4sALMB8qN5ee67yZ6MeQWjd5iyS8lINAg';
  readonly VAPID_PUBLIC_KEY = 'BNM4T5OfSHrO4XankTJSj2Erh4-JKdVlulhuPkE4A_BorcFRkgzZ1oFCF_Sg9rwzFqBN4qqQcrF8D5cefZVwUzM';

  constructor(
    private swPush: SwPush,
    private http: HttpClient,
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

  subs(): void {
    console.log('点击事件: subs');
    this.swPush.requestSubscription({
      serverPublicKey: this.VAPID_PUBLIC_KEY
    }).then(sub => {
      console.log('订阅通知✅', sub);
      return this.http.post('/api/notifications', sub).subscribe(
        () => console.log('===> 将推送订阅对象发送到服务器'),
        err => console.log('无法将订阅对象发送到服务器，原因: ', err)
      );
    }).catch(err => console.error('无法订阅通知❌', err));
  }

  push(): void {
    console.log('点击事件: push');
    this.http.post('/api/newsletter', null).subscribe(res => console.log('发送事件监听...'));
  }

}
