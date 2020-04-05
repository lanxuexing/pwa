import { ApplicationRef, Injectable, OnDestroy } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { concat, interval, NEVER, Observable, Subject } from 'rxjs';
import { first, map, takeUntil, tap } from 'rxjs/operators';


/**
 * SwUpdatesService
 *
 * @description
 * 1. 实例化后检查可用的ServiceWorker更新.
 * 2. 每6小时重新检查一次.
 * 3. 只要有可用的更新, 就会激活更新.
 *
 * @propertys
 * `updateActivated` {Observable<string>} - 每当激活更新时，发出版本哈希.
 */
@Injectable({
  providedIn: 'root'
})
export class SwUpdatesService implements OnDestroy {
  private checkInterval = 1000 * 60 * 60 * 6; // 6 小时
  private onDestroy = new Subject<void>();
  updateActivated: Observable<string>;

  constructor(
    appRef: ApplicationRef,
    private swu: SwUpdate
  ) {
    if (!swu.isEnabled) {
      this.updateActivated = NEVER.pipe(takeUntil(this.onDestroy));
      return;
    }

    // 定期检查更新(在应用稳定后).
    const appIsStable = appRef.isStable.pipe(first(v => v));
    concat(appIsStable, interval(this.checkInterval))
        .pipe(
            tap(() => this.log('Checking for update...')),
            takeUntil(this.onDestroy),
        )
        .subscribe(() => this.swu.checkForUpdate());

    // 激活可用的更新.
    this.swu.available
        .pipe(
            tap(evt => this.log(`Update available: ${JSON.stringify(evt)}`)),
            takeUntil(this.onDestroy),
        )
        .subscribe(() => this.swu.activateUpdate());

    // 通知已激活的更新.
    this.updateActivated = this.swu.activated.pipe(
        tap(evt => this.log(`Update activated: ${JSON.stringify(evt)}`)),
        map(evt => evt.current.hash),
        takeUntil(this.onDestroy),
    );
  }

  ngOnDestroy() {
    this.onDestroy.next();
  }

  private log(message: string) {
    const timestamp = new Date().toISOString();
    console.log(`[SwUpdates - ${timestamp}]: ${message}`);
  }
}
