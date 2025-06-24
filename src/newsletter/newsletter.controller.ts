import { Controller, Post } from '@nestjs/common'

@Controller('newsletter')
export class NewsletterController {
    @Post('subscribe')
    subscribe () {
        // Logic for subscribing to the newsletter
        return { message: 'Subscribed successfully!' }
    }
}
