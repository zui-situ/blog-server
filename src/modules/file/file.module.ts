import { forwardRef, Module } from '@nestjs/common';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { OssService } from '../../../libs/common/oss/oss.service';

@Module({
  imports: [forwardRef(() => OssService)],
  controllers: [FileController],
  providers: [FileService],
  exports: [FileService],
})
export class FileModule {}
