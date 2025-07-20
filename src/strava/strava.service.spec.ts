import { Test, TestingModule } from '@nestjs/testing'
import { StravaService } from './strava.service'
import { HttpService } from '@nestjs/axios'
import { ConfigService } from '@nestjs/config'
import { of, throwError } from 'rxjs'
import { Logger } from '@nestjs/common'

const mockConfig = {
    STRAVA_CLIENT_ID: 'test-client-id',
    STRAVA_CLIENT_SECRET: 'test-client-secret',
    STRAVA_REDIRECT_URI: 'http://localhost/redirect',
}

describe('StravaService', () => {
    let service: StravaService
    let httpService: { post: jest.Mock; get: jest.Mock }
    let configService: { get: jest.Mock }
    let logger: { error: jest.Mock }

    beforeEach(async () => {
        httpService = {
            post: jest.fn(),
            get: jest.fn(),
        }
        configService = {
            get: jest.fn(
                (key: string) => mockConfig[key as keyof typeof mockConfig],
            ),
        }
        logger = {
            error: jest.fn(),
        }
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                StravaService,
                { provide: HttpService, useValue: httpService },
                { provide: ConfigService, useValue: configService },
                { provide: Logger, useValue: logger },
            ],
        }).compile()

        service = module.get<StravaService>(StravaService)
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })

    describe('getAuthRedirectUrl', () => {
        it('should return the correct Strava auth URL', () => {
            const url = service.getAuthRedirectUrl()
            expect(url).toContain(mockConfig.STRAVA_CLIENT_ID)
            expect(url).toContain(mockConfig.STRAVA_REDIRECT_URI)
            expect(url).toContain('response_type=code')
        })
    })

    describe('exchangeToken', () => {
        it('should return access token on success', async () => {
            const mockResponse = { data: { access_token: 'token123' } }
            httpService.post.mockReturnValue(of(mockResponse))
            const token = await service.exchangeToken('code123')
            expect(httpService.post).toHaveBeenCalledWith(
                'https://www.strava.com/oauth/token',
                expect.objectContaining({
                    client_id: mockConfig.STRAVA_CLIENT_ID,
                    client_secret: mockConfig.STRAVA_CLIENT_SECRET,
                    code: 'code123',
                    grant_type: 'authorization_code',
                }),
            )
            expect(token).toBe('token123')
        })

        it('should throw error on failure', async () => {
            httpService.post.mockReturnValue(
                throwError(() => new Error('fail')),
            )
            await expect(service.exchangeToken('badcode')).rejects.toThrow(
                'Failed to exchange token with Strava',
            )
        })
    })

    describe('getActivities', () => {
        it('should return activities on success', async () => {
            const mockActivities = [{ id: 1 }, { id: 2 }]
            httpService.get.mockReturnValue(of({ data: mockActivities }))
            const result = await service.getActivities('token123')
            expect(httpService.get).toHaveBeenCalledWith(
                'https://www.strava.com/api/v3/athlete/activities',
                expect.objectContaining({
                    headers: { Authorization: 'Bearer token123' },
                }),
            )
            expect(result).toEqual(mockActivities)
        })

        it('should throw error on failure', async () => {
            httpService.get.mockReturnValue(throwError(() => new Error('fail')))
            await expect(service.getActivities('token123')).rejects.toThrow(
                'Failed to fetch activities from Strava',
            )
        })
    })
})
