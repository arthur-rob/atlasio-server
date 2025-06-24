import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { NewsletterModule } from './newsletter/newsletter.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule, ConfigService } from '@nestjs/config'

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true, // rend ConfigModule disponible dans toute l'app
        }),
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                type: 'mysql',
                host: configService.get<string>('DB_HOST'),
                port: parseInt(
                    configService.get<string>('DB_PORT') || '3306',
                    10,
                ),
                username: configService.get<string>('DB_USERNAME'),
                password: configService.get<string>('DB_PASSWORD'),
                database: configService.get<string>('DB_NAME'),
                autoLoadEntities: true,
                synchronize:
                    configService.get<string>('NODE_ENV') !== 'production',
            }),
        }),
        NewsletterModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
