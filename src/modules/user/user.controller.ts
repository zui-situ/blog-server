import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { User, UserDocument } from '@app/db/models/user.model';
import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { UserService } from './user.service';
import { RegisterDTO, LoginDTO } from './user.dto';
import { AuthService } from '../auth/auth.service';
import { RCode } from '../../utils/rcode';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'libs/common/decorator/current.user.decorator';
import { Crud } from 'nestjs-mongoose-crud';

//添加增删改查方法
// @Crud({
//   model: User,
// })
@Controller('user')
@ApiTags('用户')
export class UserController {
  //注入模块
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UserService,
    @InjectModel(User) private model: ReturnModelType<typeof User>,
  ) {}

  @Post('register')
  @ApiOperation({ summary: '注册' })
  async register(@Body() body: RegisterDTO): Promise<any> {
    return this.usersService.register(body);
  }
  // JWT验证 - Step 1: 用户请求登录
  @Post('login')
  @ApiOperation({ summary: '登录' })
  @ApiBody({
    description: '用户登录',
    type: LoginDTO,
  })
  @UseGuards(AuthGuard('local'))
  async login(
    @Body() loginParmas: LoginDTO,
    @CurrentUser() user: UserDocument,
  ): Promise<any> {
    // console.log('JWT验证 - Step 1: 用户请求登录');
    return this.authService.certificate(user);
  }

  @Get('userInfo')
  @ApiOperation({ summary: '获取用户信息' })
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth() //标签这个接口需要传递token
  async user(@CurrentUser() user: UserDocument): Promise<any> {
    return this.usersService.userInfo(user);
  }
}
