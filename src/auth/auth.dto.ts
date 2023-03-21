import { ApiProperty } from '@nestjs/swagger';

export class GitlabToken {
  access_token: string;
}

export class GetTokenByApplications {
  @ApiProperty({ example: 'iPzSxfuXv81JAU7EXr3bog' })
  code: string;
}

export class GetZjLabUserInfo {
  @ApiProperty({ example: 'ST-3606-4K52CKfYWbsqlugr1rMTGRniLkz6Mb0dfxH'})
  ticket: string;
}

export class UserLoginInfo {
  @ApiProperty({ example: 'testuser'})
  user: string;
  @ApiProperty({ example: 'testpass'})
  password: string;
  // @ApiProperty({ example: 'email'})
  // email: string;
}


