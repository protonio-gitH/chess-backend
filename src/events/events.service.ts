import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  MessageEvent,
} from '@nestjs/common';
import { Subject, interval, Subscription, Observable } from 'rxjs';
import { GameEvent } from './types';

@Injectable()
export class EventsService implements OnModuleInit, OnModuleDestroy {
  private gamesStream = new Subject<any>();
  private sub!: Subscription;

  get game$(): Observable<GameEvent> {
    return this.gamesStream.asObservable();
  }

  onModuleInit() {
    // this.sub = interval(3000).subscribe(() => {
    //   this.sendGames({ time: Date.now() });
    // });
  }

  onModuleDestroy() {
    // this.sub.unsubscribe();
  }

  sendGames(event: any) {
    this.gamesStream.next({ data: event });
  }
}
