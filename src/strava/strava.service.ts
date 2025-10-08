import { Injectable, Logger } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { firstValueFrom } from 'rxjs'
import { ConfigService } from '@nestjs/config'
import { AxiosResponse } from 'axios'

import {
    StravaActivity,
    StravaTokenResponse,
} from './interfaces/strava.interfaces'

@Injectable()
export class StravaService {
    private readonly logger = new Logger(StravaService.name)
    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
    ) {}

    private get clientId(): string {
        return this.configService.get<string>('STRAVA_CLIENT_ID') ?? ''
    }

    private get clientSecret(): string {
        return this.configService.get<string>('STRAVA_CLIENT_SECRET') ?? ''
    }

    private get redirectUri(): string {
        return this.configService.get<string>('STRAVA_REDIRECT_URI') ?? ''
    }

    getAuthRedirectUrl(): string {
        return `https://www.strava.com/oauth/authorize?client_id=${this.clientId}&response_type=code&redirect_uri=${this.redirectUri}&approval_prompt=auto&scope=activity:read_all`
    }

    async exchangeToken(code: string): Promise<string> {
        try {
            const res: AxiosResponse<StravaTokenResponse> =
                await firstValueFrom(
                    this.httpService.post<StravaTokenResponse>(
                        'https://www.strava.com/oauth/token',
                        {
                            client_id: this.clientId,
                            client_secret: this.clientSecret,
                            code,
                            grant_type: 'authorization_code',
                        },
                    ),
                )
            this.logger.log(res.data)
            return res.data.access_token
        } catch (error) {
            const context = 'Failed to exchange token with Strava'
            if (error instanceof Error) {
                this.logger.error(context, error.stack || error.message)
            } else {
                this.logger.error(context, JSON.stringify(error))
            }
            throw new Error(context)
        }
    }

    async getActivities(token: string): Promise<StravaActivity[]> {
        try {
            const res: AxiosResponse<StravaActivity[]> = await firstValueFrom(
                this.httpService.get<StravaActivity[]>(
                    'https://www.strava.com/api/v3/athlete/activities',
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    },
                ),
            )
            return res.data
        } catch (error) {
            const context = 'Failed to fetch activities from Strava'
            if (error instanceof Error) {
                this.logger.error(context, error.stack || error.message)
            } else {
                this.logger.error(context, JSON.stringify(error))
            }
            throw new Error(context)
        }
    }
}
