import { IsEmail, IsOptional, IsBoolean } from 'class-validator'

export class CreateNewsletterDto {
    @IsEmail()
    email: string

    @IsOptional()
    @IsBoolean()
    isSubscribed?: boolean
}
