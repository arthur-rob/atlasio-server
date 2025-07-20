import { Test, TestingModule } from '@nestjs/testing'
import { StravaController } from './strava.controller'
import { StravaService } from './strava.service'

const mockStravaService = {
    getAuthRedirectUrl: jest.fn(),
    exchangeToken: jest.fn(),
    getActivities: jest.fn(),
}

describe('StravaController', () => {
    let controller: StravaController

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [StravaController],
            providers: [
                {
                    provide: StravaService,
                    useValue: mockStravaService,
                },
            ],
        }).compile()

        controller = module.get<StravaController>(StravaController)
    })

    it('should be defined', () => {
        expect(controller).toBeDefined()
    })
})
