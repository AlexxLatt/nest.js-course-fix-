import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { User } from '@app/decorators/user.decorator';
import { ProfileResponseInterface } from './types/profileResponse.interface';
import { AuthGuard } from '@app/guards/auth.guard';

@Controller('profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}
  @Get(':username')
  async getProfile(
    @Param('username') profileUsername: string,
    @User('id') currentUserId: number,
  ): Promise<ProfileResponseInterface> {
    const profile = await this.profileService.getProfile(
      profileUsername,
      currentUserId,
    );
    return await this.profileService.buildProfilelResponse(profile);
  }
  @Post(':username/follow')
  @UseGuards(AuthGuard)
  async followProfile(
    @User('id') currentUserId: number,
    @Param('username') profileUsername: string,
  ): Promise<ProfileResponseInterface> {
    const profile = await this.profileService.followProfile(
      profileUsername,
      currentUserId,
    );
    return await this.profileService.buildProfilelResponse(profile);
  }

  @Delete(':username/follow')
  @UseGuards(AuthGuard)
  async deleteFollowProfile(
    @User('id') currentUserId: number,
    @Param('username') profileUsername: string,
  ): Promise<ProfileResponseInterface> {
    const profile = await this.profileService.deleteFollowProfile(
      profileUsername,
      currentUserId,
    );
    return await this.profileService.buildProfilelResponse(profile);
  }
}
