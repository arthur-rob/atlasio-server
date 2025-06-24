import { Test, TestingModule } from '@nestjs/testing'
import { NewsletterController } from './newsletter.controller'

import { NewsletterService } from './newsletter.service';
import { Repository } from 'typeorm'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Newsletter } from './entities/newsletter.entity'

const mockNewsletterService = {
    create: jest.fn().mockResolvedValue({ isSubscribed: true }),
    update: jest.fn().mockResolvedValue({ isSubscribed: false }),
};

describe('NewsletterController', () => {
    let controller: NewsletterController
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [NewsletterController],
            providers: [
                {
                    provide: NewsletterService,
                    useValue: mockNewsletterService
                },
            ],
        }).compile()

        controller = module.get<NewsletterController>(NewsletterController)
        
    })

    it('should be defined', () => {
        expect(controller).toBeDefined()
    })
    it('should call newsletterService.create on subscribe', async () => {
        const dto = { email: 'test@example.com' }
        await controller.subscribe(dto as any)
        expect(mockNewsletterService.create).toHaveBeenCalledWith(dto)
    })

    it('should call newsletterService.update on update', async () => {
        const id = '123'
        const dto = { isSubscribed: false }
        await controller.update(id, dto as any)
        expect(mockNewsletterService.update).toHaveBeenCalledWith(id, dto)
    })
})
