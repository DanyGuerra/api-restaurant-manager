import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PopularityTasksService } from './popularity-tasks.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
        ]),
    ],
    providers: [PopularityTasksService],
})
export class TasksModule { }
