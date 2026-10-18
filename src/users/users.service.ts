import {
    Injectable,
    NotFoundException,
    ConflictException,
} from '@nestjs/common'
import { Repository } from 'typeorm'
export interface User {
    username?: string
    password?: string
    email: string
}
export interface UserObject extends User {
    id: number
}

@Injectable()
export class UsersService {
    private readonly userRepository: Repository<UserObject>

    async findOne(email: string): Promise<UserObject | null> {
        const user = await this.userRepository.findOneBy({ email })
        if (!user) throw new NotFoundException(`User with mail ${email} not found`)
        return user
    }
    async create(userData: User): Promise<UserObject> {
        const existing = await this.userRepository.findOneBy({
            email: userData.email,
        })
        if (existing) throw new ConflictException('User already exist')
        const newUser = this.userRepository.create(userData)
        return this.userRepository.save(newUser)
    }
}
