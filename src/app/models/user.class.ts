export class User{
    name: string;
    email: string;
    passwort: string;
    avatar: string;

    constructor(obj?: any){
        this.name = obj ? obj.name: '';
        this.email = obj ? obj.email: '';
        this.passwort = obj ? obj.passwort: '';
        this.avatar = obj ? obj.avatar: '';
    }
}