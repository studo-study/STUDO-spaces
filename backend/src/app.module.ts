import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { StudysetModule } from './studyset/studyset.module';
import { StudysessionModule } from './studysession/studysession.module';
import { ProfileModule } from './profile/profile.module';
import { FolderModule } from './folder/folder.module';
import { ClassroomModule } from './classroom/classroom.module';
import { PinModule } from './pin/pin.module';
import { VisualsetModule } from './visualset/visualset.module';

@Module({
  imports: [
    UserModule,
    StudysetModule,
    StudysessionModule,
    ProfileModule,
    FolderModule,
    ClassroomModule,
    PinModule,
    VisualsetModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
