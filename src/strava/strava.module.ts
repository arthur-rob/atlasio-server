import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { StravaController } from './strava.controller'
import { StravaService } from './strava.service'

@Module({
    imports: [HttpModule],
    controllers: [StravaController],
    providers: [StravaService],
})
export class StravaModule {}
