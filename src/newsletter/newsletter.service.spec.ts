/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing'
import { NewsletterService } from './newsletter.service'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Newsletter } from './entities/newsletter.entity'
import { Repository } from 'typeorm'
import { NotFoundException } from '@nestjs/common'
import { UpdateNewsletterDto } from './dto/update-newsletter.dto'
import { CreateNewsletterDto } from './dto/create-newsletter.dto'

const mockNewsletterRepository = () => ({
    create: jest.fn(),
    save: jest.fn(),
    findOneBy: jest.fn(),
})

describe('NewsletterService', () => {
    let service: NewsletterService
    let repository: jest.Mocked<Repository<Newsletter>>

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                NewsletterService,
                {
                    provide: getRepositoryToken(Newsletter),
                    useFactory: mockNewsletterRepository,
                },
            ],
        }).compile()

        service = module.get<NewsletterService>(NewsletterService)
        repository = module.get(getRepositoryToken(Newsletter))
    })
    describe('define', () => {
        it('should be defined', () => {
            expect(service).toBeDefined()
        })
    })

    describe('create', () => {
        it('should create and save a newsletter', async () => {
            const dto: CreateNewsletterDto = { email: 'test@example.com' }
            const createdNewsletter = { id: '1', ...dto }
            repository.create.mockReturnValue(createdNewsletter as Newsletter)
            repository.save.mockResolvedValue(createdNewsletter as Newsletter)

            const result = await service.create(dto)
            expect(repository.create).toHaveBeenCalledWith(dto)
            expect(repository.save).toHaveBeenCalledWith(createdNewsletter)
            expect(result).toEqual(createdNewsletter)
        })
    })

    describe('update', () => {
        it('should update and save a newsletter', async () => {
            const id = '1'
            const dto: UpdateNewsletterDto = { isSubscribed: false }
            const existingNewsletter = {
                id,
                email: 'old@example.com',
                isSubscribed: true,
            }
            const updatedNewsletter = { ...existingNewsletter, ...dto }

            repository.findOneBy.mockResolvedValue(
                existingNewsletter as Newsletter,
            )
            repository.save.mockResolvedValue(updatedNewsletter as Newsletter)

            const result = await service.update(id, dto)
            expect(repository.findOneBy).toHaveBeenCalledWith({
                id,
            })
            expect(repository.save).toHaveBeenCalledWith(updatedNewsletter)
            expect(result).toEqual(updatedNewsletter)
        })

        it('should throw NotFoundException if newsletter not found', async () => {
            repository.findOneBy.mockResolvedValue(null)
            await expect(service.update('nonexistent', {})).rejects.toThrow(
                NotFoundException,
            )
        })
    })
})
