import { IsOptional, IsBoolean } from 'class-validator'

export class UpdateNewsletterDto {
    @IsOptional()
    @IsBoolean()
    isSubscribed?: boolean
}
