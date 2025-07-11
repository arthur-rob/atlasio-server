import { Module } from '@nestjs/common'
import { Newsletter } from './entities/newsletter.entity'
import { NewsletterService } from './newsletter.service'
import { NewsletterController } from './newsletter.controller'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
    imports: [TypeOrmModule.forFeature([Newsletter])],
    providers: [NewsletterService],
    controllers: [NewsletterController],
})
export class NewsletterModule {}
