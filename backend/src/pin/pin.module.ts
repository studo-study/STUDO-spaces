import { Module } from '@nestjs/common';
import { PinController } from './pin.controller';
import { Pin } from './pin';

@Module({
  imports: [],
  controllers: [PinController],
  providers: [Pin],
})
export class PinModule {}
