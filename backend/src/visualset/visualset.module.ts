import { Module } from '@nestjs/common';
import { VisualsetController } from './visualset.controller';
import { VisualsetService } from './visualset.service';

@Module({
  imports: [],
  controllers: [VisualsetController],
  providers: [VisualsetService],
})
export class VisualsetModule {}
