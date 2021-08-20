import { ApplicationContract } from '@ioc:Adonis/Core/Application'
import { IocContract } from '@adonisjs/fold'
// import { PengooService } from 'App/Services/users/PengooService';
// import { FounderService } from 'App/Services/users/FounderService';
// import { StaffService } from 'App/Services/users/StaffService';
// import { RoleService } from 'App/Services/role/RoleService';
// import { CloudinaryService } from 'App/Services/cloudinary/CloudinaryService';
// import { GooCardService } from 'App/Services/goocard/GooCardService';
// import { PengerService } from 'App/Services/users/PengerService';
// import { AuthService } from 'App/Services/auth/AuthService';
export default class AppProvider {
  constructor(protected app: ApplicationContract, protected container: IocContract) {
  }

  public register() {
    // // Register your own bindings
    // this.container.singleton('PengoProject/PengooService', () => {
    //   // const PengooService = this.container.use('App/Services/users/PengooService');
    //   return new PengooService();
    // });
    // this.container.singleton('PengoProject/FounderService', () => {
    //   // const FounderService = this.container.use('App/Services/users/FounderService');
    //   return new FounderService();
    // });
    // this.container.singleton('PengoProject/StaffService', () => {
    //   // const StaffService = this.container.use('App/Services/users/StaffService');
    //   return new StaffService();
    // });
    // this.container.singleton('PengoProject/RoleService', () => {
    //   // const RoleService = this.container.use('App/Services/role/RoleService');
    //   return new RoleService();
    // });
    // this.container.singleton('PengoProject/CloudinaryService', () => {
    //   // const CloudinaryService = this.container.use('App/Services/cloudinary/CloudinaryService');
    //   return new CloudinaryService();
    // });
    // this.container.singleton('PengoProject/GoocardService', () => {
    //   // const GoocardService = this.container.use('App/Services/goocard/GoocardService');
    //   return new GooCardService();
    // });
    // this.container.singleton('PengoProject/PengerService', () => {
    //   // const PengerService = this.container.use('App/Services/users/PengooService');
    //   return new PengerService();
    // });
    // this.container.singleton('PengoProject/AuthService', () => {
    //   // const AuthService = this.container.use('App/Services/auth/AuthService');
    //   return new AuthService();
    // });
  }

  public async boot() {
    // IoC container is ready
  }

  public async ready() {
    // App is ready
    if (this.app.environment === 'web') {
      await import('../start/socket')
    }
  }

  public async shutdown() {
    // Cleanup, since app is going down
  }
}
