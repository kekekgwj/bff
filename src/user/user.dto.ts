import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
export class AddUserDto {
  @ApiProperty({ example: 123, })
  id?: string;

  @ApiProperty({ example: 'cookie' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'cookieboty@qq.com' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'cookieboty' })
  @IsNotEmpty()
  username: string;
}

export class UserRegister {
  @ApiProperty({example: 'testRegister@zjlab.com'})
  email: string;
  @ApiProperty({example: 'testRegister'})
  username: string;
  @ApiProperty({example: '之江实验室'})
  company: string;
  @ApiProperty({example: '科研'})
  companyType: string;
  @ApiProperty({example: 'testpassword'})
  password: string;
}

export class UserVerify {
  username: string;
  password: string;
  verifyCode: string;
}
export class UserActivate {
  @ApiProperty({example: 'testRegister@zjlab.com'})
  username: string;
  @ApiProperty({example: 'xxxyyy'})
  code: string;
}