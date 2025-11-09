import { Injectable } from '@nestjs/common'

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
    private readonly users: UserObject[] = [
        {
            id: 1,
            username: 'john',
            password: 'changeme',
            email: 'test@mail.com',
        },
        {
            id: 2,
            username: 'Arthur',
            password: '123',
            email: 'arthur@mail.com',
        },
    ]

    findOne(email: string): UserObject | undefined {
        return this.users.find((user) => user.email === email)
    }
    create(userData: User): UserObject {
        const user = { id: Date.now(), ...userData } as UserObject
        this.users.push(user)
        return user
    }
}
