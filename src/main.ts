import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppExceptionFilter } from './app.exception-filter';

async function bootstrap(): Promise<void> {
        const app = await NestFactory.create(AppModule);
        app.useGlobalPipes(new ValidationPipe());
        app.useGlobalFilters(new AppExceptionFilter());

        const config = new DocumentBuilder()
                .setTitle('Impulse Test API')
                .build();

        const document = SwaggerModule.createDocument(app, config);
        SwaggerModule.setup('api', app, document);

        await app.listen(3000);
}
bootstrap();
