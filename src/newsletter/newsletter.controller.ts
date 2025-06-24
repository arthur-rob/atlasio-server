import { Controller, Post, Body, Param, Patch, HttpCode } from '@nestjs/common'
import { NewsletterService } from './newsletter.service'
import { CreateNewsletterDto } from './dto/create-newsletter.dto'
import { UpdateNewsletterDto } from './dto/update-newsletter.dto'

@Controller('newsletter')
export class NewsletterController {
    constructor(private readonly newsletterService: NewsletterService) {}

    @Post('subscribe')
    @HttpCode(201)
    async subscribe(@Body() createDto: CreateNewsletterDto) {
        await this.newsletterService.create(createDto)
    }

    @Patch(':id')
    @HttpCode(204)
    async update(
        @Param('id') id: string,
        @Body() updateDto: UpdateNewsletterDto,
    ) {
        await this.newsletterService.update(id, updateDto)
    }
}
