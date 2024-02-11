export class User{
    name: string;
    email: string;
    password: string;
    userId: string;
    avatar: string;

    constructor(obj?: any){
        this.name = obj ? obj.name: '';
        this.email = obj ? obj.email: '';
        this.password = obj ? obj.password: '';
        this.userId = obj ? obj.userId: '';
        this.avatar = obj ? obj.avatar: './assets/img/login/SingIn/emptyProfile.png';
    }

    toJson() {
        return {
          name: this.name,
          email: this.email,
          userId: this.userId,
          avatar: this.avatar
        };
      }
}