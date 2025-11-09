import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common'
import { AuthService } from './auth.service'
import { LocalAuthGuard } from './guards/local-auth.guard'
import { UserObject } from 'src/users/users.service'

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('register')
    async register(@Body() body: { email: string; password: string }) {
        return this.authService.register(body.email, body.password)
    }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    login(@Req() req: Request & { user: UserObject }) {
        return this.authService.login(req.user)
    }
}
