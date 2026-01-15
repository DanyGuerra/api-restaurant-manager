import { Controller, Get, HttpCode } from '@nestjs/common';

@Controller('help')
export class HelpController {
  @Get()
  @HttpCode(200)
  apiHelp() { }
}
