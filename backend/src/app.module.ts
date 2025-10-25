import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersController } from './user/users.controller';
import { StudysetsController } from './studyset/studysets.controller';
import { ClassroomController } from './classroom/classroom.controller';
import { StudysessionController } from './studysession/studysession.controller';
import { HealthController } from './health/health.controller';
import { FolderController } from './folder/folder.controller';
import { CardController } from './card/card.controller';
import { CardService } from './card/card.service';
import { ClassroomService } from './classroom/classroom.service';
import { FolderService } from './folder/folder.service';
import { StudysessionService } from './studysession/studysession.service';
import { StudysetService } from './studyset/studyset.service';
import { UserService } from './user/users.service';

@Module({
  imports: [],
  controllers: [
    AppController,
    HealthController,
    UsersController,
    StudysetsController,
    ClassroomController,
    StudysessionController,
    FolderController,
    CardController,
  ],
  providers: [
    AppService,
    CardService,
    ClassroomService,
    FolderService,
    StudysessionService,
    StudysetService,
    UserService,
  ],
})
export class AppModule {}
