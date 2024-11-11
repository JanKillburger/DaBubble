import { DocumentData, FirestoreDataConverter } from "@angular/fire/firestore"

export type DocData = ChannelData | Chat | Message | UserData
export type NewDocData = Omit<ChannelData, 'id'> | Omit<Chat, 'id'> | Omit<Message, 'id'> | Omit<UserData, 'id'> | Omit<Reply, 'id'>
export type DbOmissions = 'id' | 'kind' | 'path'
export type DbModel<T> = Omit<T, DbOmissions>
export type DocKind = DocData['kind']
export type DocPath = DocData['path'] 

interface BaseProps {
  id: string,
  readonly converter: FirestoreDataConverter<unknown, DocumentData>
}
export interface UserData extends BaseProps{
  readonly kind: 'user',
  path: ['users'],
  name: string,
  email: string,
  authId: string,
  userId: string,
  avatar: string,
  online: boolean,
  channelIds: string[]
}

export interface DbUser {
  name: string,
  email: string,
  avatar: string,
  isOnline: boolean,
  channelIds: string[]
}

export type ChatUser = Pick<UserData, 'id' | 'name'>

export interface ChannelData extends BaseProps {
  readonly kind: 'channel',
  path: ['channels'],
  channelCreator: string;
  channelName: string;
  channelDescription: string;
  users: string[],
  readonly membersCount?: number,
  previewUserIds?: string[],
  previewUsers?: null | { [key: string]: { avatar: string } },
}

export interface DbChannel {
  createdBy: string,
  description: string,
  name: string,
  userIds: string[],
  previewUsers: { [userId: string]: { avatar: string } } | null,
  previewUserIds: string[]
}

export interface messages {
  [key: string]: Message[];
}

interface AbstractMessage extends BaseProps {
  message: string;
  readonly from: string;
  readonly timestamp: number;
  readonly date?: string;
  reactions?: Emoji[];
  readonly created: Date;
}

export interface Reply extends AbstractMessage {
  readonly kind: 'reply',
  readonly path: ['channels' | 'chats', string, 'messages', string, 'replies'],
}

export interface DbReply {
  message: string,
  from: string,
  timestamp: number,
  reactions: Emoji[],
}

export interface Message extends AbstractMessage {
  readonly kind: 'message',
  readonly path: ['channels' | 'chats', string, 'messages'],
  repliesCount?: number,
  lastReplyAt?: number,
  lastReplyDate?: string
}

export interface DbMessage extends DbReply {
  repliesCount?: number,
  lastReplyAt?: number
}

export interface SearchData {
  channelId: string;
  channelName: string;
  messageId: string;
  message: string;
}

export interface Chat extends BaseProps {
  readonly kind: 'chat',
  readonly path: ['chats'],
  readonly users: string[],
  readonly participants?: {[key: string]: ChatUser},
  readonly recipient?: ChatUser,
}

export interface DbChat {
  userIds: string[],
  participants: {[key: string]: ChatUser}
}

export interface Emoji {
  emoji: string,
  userId: string[]
}

export type MessagesByDay = {
  [key: string]: Message[] | undefined
}