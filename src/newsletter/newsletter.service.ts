import { 
    Injectable,
    NotFoundException, 
    ConflictException, } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Newsletter } from './entities/newsletter.entity'
import { CreateNewsletterDto } from './dto/create-newsletter.dto'
import { UpdateNewsletterDto } from './dto/update-newsletter.dto'

@Injectable()
export class NewsletterService {
    constructor(
        @InjectRepository(Newsletter)
        private readonly newsletterRepository: Repository<Newsletter>,
    ) {}

    async create(dto: CreateNewsletterDto): Promise<Newsletter> {
        const existing = await this.newsletterRepository.findOneBy({ email: dto.email })
        if (existing) throw new ConflictException('User is already subscribed')
        const newsletter = this.newsletterRepository.create(dto)
        return this.newsletterRepository.save(newsletter)
    }

    async update(id: string, dto: UpdateNewsletterDto): Promise<Newsletter> {
        const newsletter = await this.newsletterRepository.findOneBy({ id })
        if (!newsletter) {
            throw new NotFoundException(`Newsletter with ID ${id} not found`)
        }
        Object.assign(newsletter, dto)
        return this.newsletterRepository.save(newsletter)
    }
}
