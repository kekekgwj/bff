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

const { MAIL, MYSQL, REDIS } = config;
@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: true,
      isGlobal: true,
      load: [getConfig]
    }),
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: REDIS.host,
      port: REDIS.port,
    }),
    UserModule,
    AuthModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: MYSQL.host,
      port: MYSQL.port,
      username: MYSQL.username,
      password: MYSQL.password,
      database: MYSQL.database,
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
