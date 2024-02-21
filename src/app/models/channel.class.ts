export class Channel {
  channelName: string;
  channelDescription: string;
  users: string[];

  constructor(obj?: any) {
    this.channelName = obj ? obj.channelName : '';
    this.channelDescription = obj ? obj.channelDescription : '';
    this.users = obj ? obj.users : [];
  }

  toJson() {
    return {
      channelName: this.channelName,
      channelDescription: this.channelDescription,
      users: this.users,
    };
  }
}
