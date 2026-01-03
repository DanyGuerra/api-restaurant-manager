import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PopularityService } from './popularity.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([]),
    ],
    providers: [PopularityService],
})
export class JobsModule { }
