import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Query,
} from '@nestjs/common';
import { UpdateCardDto } from '../studyset/card.dto';
import { CardService } from './card.service';

@Controller('card')
export class CardController {
  constructor(private readonly cardsService: CardService) {}
  @Get(':user_id/sets/:set_id')
  getAllCardsByStudyset(
    @Param('user_id') user_id: string,
    @Param('set_id') set_id: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return `This action returns all cards from studyset ${set_id} from user ${user_id}`;
  }

  @Get(':id')
  getCardById(@Param('id') id: string) {
    return `This action returns card with id ${id}`;
  }

  @Put()
  updateCard(@Param('id') id: string, @Body() updateCard: UpdateCardDto) {
    return 'not yet implemented';
  }

  @Delete(':id')
  deletePlace(@Param('id') id: string) {
    return `This action removes the card with id #${id}`;
  }
}
