import { CacheModule, Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { getConfig } from './utils';
import * as redisStore from 'cache-manager-redis-store';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

const config = getConfig();

const { MAIL } = config;
@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: true,
      isGlobal: true,
      load: [getConfig]
    }),
    UserModule,
    AuthModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '10.101.104.61',
      port: 3307,
      username: 'root',
      password: '123456',
      database: 'zjlab',
      entities: [User],
      synchronize: true,
    }),
    MailerModule.forRoot({
      transport: {
        host: MAIL.host,
        port: MAIL.port,
        auth: {
          user: MAIL.user,
          pass: MAIL.pass,
        }
      },
      template: {
        dir: process.cwd() + '/templates/',
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    })
  ],
  controllers: [],
  // providers: [
  //   {
  //     provide: APP_GUARD,
  //     useClass: JwtAuthGuard,
  //   },
  // ],
})
export class AppModule { }
