import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ConfigService } from '@nestjs/config'

async function bootstrap() {
    const app = await NestFactory.create(AppModule)
    const configService = app.get(ConfigService)
    const origins = configService.get<string>('CORS_ORIGINS') || ''
    const port = configService.get<string>('PORT') || 3000;
    const originList = origins
        .split(',')
        .map((o) => o.trim())
        .filter(Boolean)

    console.log('Allowed CORS origins:', originList)

    app.enableCors({
        origin: origins.split(','),
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
        allowedHeaders: 'Content-Type, Authorization',
    })

    await app.listen(port, "0.0.0.0")
}
bootstrap()
