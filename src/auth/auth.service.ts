import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UsersService, type UserObject } from '../users/users.service'
import bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) {}

    async validateUser(
        email: string,
        password: string,
    ): Promise<UserObject | null> {
        const user = this.usersService.findOne(email)
        if (!user || !user.password) return null

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) return null

        const { password: _pw, ...result } = user
        return result
    }

    async register(
        email: string,
        password: string,
    ): Promise<{ access_token: string; user: UserObject }> {
        const hashed = await bcrypt.hash(password, 10)
        const user = this.usersService.create({ email, password: hashed })
        const { password: _pw, ...userWithoutPassword } = user
        return this.login(userWithoutPassword)
    }

    login(user: UserObject): { access_token: string; user: UserObject } {
        const payload = { sub: user.id, email: user.email }
        const token = this.jwtService.sign(payload)

        return {
            access_token: token,
            user,
        }
    }
}
