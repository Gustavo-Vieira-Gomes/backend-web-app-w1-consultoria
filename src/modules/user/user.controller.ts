import { Body, Controller, Post, Get, Param } from "@nestjs/common";

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get(':id')
    async getById(
        @Param('id') id: string
    ) {
        return this.userService.getById(id);
    }

    @Put(':id')
    async updateUser(
        @Param('id') id: string,
        payload: UpdateUserDto
    ) {
        return this.userService.updateUser(id, payload);
    }
    
    @Patch(':id')
    async softDeleteUser(
        @Param('id') id: string
    ) {
        return this.userService.softDeleteUser(id);
    }
  
    @Patch('password')
    async changeUserPassword(
        @Param('id') id: string,
        @Param('oldPassword') oldPassword: string,
        @Param('newPassword') newPassword: string,
        @Param('newPasswordConfirm') newPasswordConfirm: string,
    ) {
        if (logado && ()) // Fetchar o user
    if (account && (await bcrypt.compare(password + account.id, account.password_hash))) {
      return this.userService.changeUserPassword(id, oldPassword, newPassword, newPasswordConfirm);
        password: bcrypt.hashSync(payload.password + payload.id, 10),
    }

    // resetUserPassword


    // verifyUserEmail


    @Get(':id')
    async getUserAssets(
      @Param('id') id: id
    ) {
      return this.userService.getUserAssets(id);
    }

    @Get(':id')
    async getUserLiabilities(
      @Param('id') id: id
    ) {
      return this.userService.getUserLiabilities(id);
    }

    @Get(':id')
    async getUserNetWorth(
      @Param('id') id: id
    ) {
      return this.userService.getUserNetWorth(id);
    }

    @Get(':id')
    async getUserInflowSummary(
      @Param('id') id: id
    ) {
      return this.userService.getUserInflowSummary(id);
    }

    @Get(':id')
    async getUserOutflowSummary(
      @Param('id') id: id
    ) {
      return this.userService.getUserOutflowSummary(id);
    }

    @Patch('phone')
    async updateUserNewPhone(
        @Param('newPhone') newPhone: string,
    ) {
      return this.userService.updateUserAdress(newPhone);
    }

    @Patch('adress')
    async updateUserAddress(
        @Param('newAdress') newAdress: adress,
    ) {
      return this.userService.updateUserAdress(newAdress);
    }

}
