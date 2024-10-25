import { Module } from '@nestjs/common';
import { OrganizationsController } from './organizations.controller';
import { OrganizationsService } from './organizations.service';
import { OrganizationsRepository } from './organizations.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Organization, OrganizationSchema } from './schemas/organization.schema';
import { OrganizationMember, OrganizationMemberSchema } from './schemas/organizationMember.schema';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Organization.name,
        schema: OrganizationSchema,
      },
    ]),
    MongooseModule.forFeature([
      {
        name: OrganizationMember.name,
        schema: OrganizationMemberSchema,
      },
    ]),
    UsersModule
  ],
  controllers: [OrganizationsController],
  providers: [OrganizationsService, OrganizationsRepository]
})
export class OrganizationsModule {}
