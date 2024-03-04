export class Channel {
  channelName: string;
  channelDescription: string;
  users: string[];
  channelCreator: string;

  constructor(obj?: any) {
    this.channelName = obj ? obj.channelName : '';
    this.channelDescription = obj ? obj.channelDescription : '';
    this.users = obj ? obj.users : [];
    this.channelCreator = obj ? obj.channelCreator : '';
  }

  toJson() {
    return {
      channelName: this.channelName,
      channelDescription: this.channelDescription,
      users: this.users,
      channelCreator: this.channelCreator
    };
  }
}
