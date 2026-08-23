import { Injectable, OnModuleInit, OnModuleDestroy, MessageEvent } from '@nestjs/common';
import { Subject, interval, Subscription, Observable } from 'rxjs';
import { GameEvent } from './types';
import { Game } from '@prisma/client';

@Injectable()
export class EventsService implements OnModuleInit, OnModuleDestroy {
  private gamesStream = new Subject<{ data: GameEvent }>();
  private sub!: Subscription;

  get game$(): Observable<{ data: GameEvent }> {
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

  public sendGames(event: GameEvent) {
    this.gamesStream.next({ data: event });
  }
}
