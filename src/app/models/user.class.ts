export class User{
    name: string;
    email: string;
    userId: string;
    password: string;
    avatar: string;

    constructor(obj?: any){
        this.name = obj ? obj.name: '';
        this.email = obj ? obj.email: '';
        this.userId = obj ? obj.userId: '';
        this.password = obj ? obj.password: '';
        this.avatar = obj ? obj.avatar: '';
    }

    toJson() {
        return {
          name: this.name,
          email: this.email,
          userId: this.userId,
          password: this.password,
          avatar: this.avatar
        };
      }
}