import { Test, TestingModule } from '@nestjs/testing'
import { StravaController } from './strava.controller'
import { StravaService } from './strava.service'
import { ConfigService } from '@nestjs/config'

const mockStravaService = {
    getAuthRedirectUrl: jest.fn(),
    exchangeToken: jest.fn(),
    getActivities: jest.fn(),
}

describe('StravaController', () => {
    let controller: StravaController
    const configService = { get: jest.fn() }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [StravaController],
            providers: [
                {
                    provide: StravaService,
                    useValue: mockStravaService,
                },
                {
                    provide: ConfigService,
                    useValue: configService,
                },
            ],
        }).compile()

        controller = module.get<StravaController>(StravaController)
    })

    it('should be defined', () => {
        expect(controller).toBeDefined()
    })
})
