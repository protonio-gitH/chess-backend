import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';

@Injectable()
export class EventsService {
  private gamesStream = new Subject<any>();

  get game$() {
    return this.gamesStream.asObservable();
  }

  sendGames(event: any) {
    this.gamesStream.next({ data: event });
  }
}
