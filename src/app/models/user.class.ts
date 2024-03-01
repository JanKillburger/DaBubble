export class User{
  name: string;
  email: string;
  authId: string
  userId: string;
  avatar: string;
  online: boolean;

    constructor(obj?: any){
        this.name = obj ? obj.name: '';
        this.email = obj ? obj.email: '';
        this.authId = obj ? obj.authId: '';
        this.userId = obj ? obj.userId: '';
        this.avatar = obj ? obj.avatar: './assets/img/login/SingIn/emptyProfile.png';
        this.online = obj ? obj.online: false;
    }

    toJson() {
        return {
          name: this.name,
          email: this.email,
          authId: this.authId,
          userId: this.userId,
          avatar: this.avatar,
          online: this.online
        };
      }
}