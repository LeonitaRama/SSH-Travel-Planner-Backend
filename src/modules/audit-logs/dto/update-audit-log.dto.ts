import { PartialType } from '@nestjs/swagger';
import { CreateAuditLogDto } from './create-audit-log.dto.js';

export class UpdateAuditLogDto extends PartialType(CreateAuditLogDto) {}
