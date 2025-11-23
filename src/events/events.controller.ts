import { Controller, Delete, Sse } from '@nestjs/common';
import { EventsService } from './events.service';

@Controller('events')
export class EventsController {
  constructor(private eventsService: EventsService) {}

  @Sse('games')
  stream() {
    return this.eventsService.game$;
  }
}
