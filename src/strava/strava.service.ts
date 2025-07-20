import { Injectable, Logger } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { firstValueFrom } from 'rxjs'
import { ConfigService } from '@nestjs/config'

import {
    StravaActivity,
    StravaTokenResponse,
} from './interfaces/strava.interfaces'

@Injectable()
export class StravaService {
    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
        private readonly logger: Logger,
    ) {}

    private get clientId(): string {
        return this.configService.get<string>('STRAVA_CLIENT_ID') || ''
    }

    private get clientSecret(): string {
        return this.configService.get<string>('STRAVA_CLIENT_SECRET') || ''
    }

    private get redirectUri(): string {
        return this.configService.get<string>('STRAVA_REDIRECT_URI') || ''
    }

    getAuthRedirectUrl(): string {
        return `https://www.strava.com/oauth/authorize?client_id=${this.clientId}&response_type=code&redirect_uri=${this.redirectUri}&approval_prompt=auto&scope=activity:read_all`
    }

    async exchangeToken(code: string): Promise<string> {
        try {
            const res = (await firstValueFrom(
                this.httpService.post('https://www.strava.com/oauth/token', {
                    client_id: this.clientId,
                    client_secret: this.clientSecret,
                    code,
                    grant_type: 'authorization_code',
                }),
            )) as { data: StravaTokenResponse }
            return res.data?.access_token
        } catch (error) {
            this.logger.error(error)
            throw new Error('Failed to exchange token with Strava')
        }
    }

    async getActivities(token: string): Promise<StravaActivity[]> {
        try {
            const res = await firstValueFrom(
                this.httpService.get(
                    'https://www.strava.com/api/v3/athlete/activities',
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    },
                ),
            )
            return res.data as StravaActivity[]
        } catch (error) {
            this.logger.error(error)
            throw new Error('Failed to fetch activities from Strava')
        }
    }
}
