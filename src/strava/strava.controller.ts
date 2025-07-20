import { Controller, Get, Res, Query } from '@nestjs/common'
import { StravaService } from './strava.service'
import { Response } from 'express'

@Controller('strava')
export class StravaController {
    constructor(private readonly stravaService: StravaService) {}

    @Get('auth')
    redirectToStrava(@Res() res: Response) {
        const url = this.stravaService.getAuthRedirectUrl()
        res.redirect(url)
    }

    @Get('callback')
    async handleCallback(@Query('code') code: string, @Res() res: Response) {
        const accessToken = await this.stravaService.exchangeToken(code)
        res.send(`
        <script>
            window.opener.postMessage({ token: "${accessToken}" }, "http://localhost:5173");
            window.close();
        </script>
      `)
    }

    @Get('activities')
    async getActivities(@Query('token') token: string) {
        return this.stravaService.getActivities(token)
    }
}
