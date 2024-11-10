import { QueryDocumentSnapshot } from "@angular/fire/firestore";
import { ChannelData, Chat, DbMessage, DbReply, DbUser, DocPath, Message, Reply, UserData } from "../models/app.model";
import { DbChannel, DbChat } from "../models/app.model";

function getUtcTimestampFromDate(date: Date): number {
  return Date.parse(date.toUTCString());
}

/**
 * Returns document path as string array exluding the document ID
 */
function getPathFromSnap(snap: QueryDocumentSnapshot) {
  return snap.ref.path.split('/').slice(0, -1)
}

const converters = {
  channel: {
    toFirestore(data: ChannelData): DbChannel {
      return {
        description: data.channelDescription,
        name: data.channelName,
        userIds: data.users,
        createdBy: data.channelCreator,
        previewUserIds: data.previewUserIds ?? [],
        previewUsers: data.previewUsers ?? null
      }
    },
    fromFirestore(snap: QueryDocumentSnapshot<DbChannel>): ChannelData {
      return {
        id: snap.id,
        kind: 'channel',
        path: getPathFromSnap(snap) as ['channels'],
        converter: converters.channel,
        channelCreator: snap.data().createdBy,
        channelDescription: snap.data().description,
        channelName: snap.data().name,
        users: snap.data().userIds,
        membersCount: snap.data().userIds.length,
        previewUserIds: snap.data().previewUserIds || [],
        previewUsers: snap.data().previewUsers || null,
      }
    },
  },
  chat: {
    toFirestore(data: Chat): DbChat {
      return {
        userIds: data.users,
        participants: data.participants || {}
      }
    },
    fromFirestore(snap: QueryDocumentSnapshot<DbChat>): Chat {
      return {
        id: snap.id,
        kind: 'chat',
        path: getPathFromSnap(snap) as ['chats'],
        converter: converters.chat,
        users: snap.data().userIds,
        participants: snap.data().participants
      }
    },
  },
  user: {
    toFirestore(data: UserData): DbUser {
      return {
        name: data.name,
        email: data.email,
        avatar: data.avatar,
        isOnline: data.online,
        channelIds: data.channelIds || []
      }
    },
    fromFirestore(snap: QueryDocumentSnapshot<DbUser>): UserData {
      const data = snap.data();
      return {
        kind: 'user',
        path: getPathFromSnap(snap) as ['users'],
        converter: converters.user,
        name: data.name,
        email: data.email,
        online: data.isOnline,
        avatar: data.avatar,
        id: snap.id,
        authId: snap.id,
        userId: snap.id,
        channelIds: data.channelIds
      }
    },
  },
  message: {
    toFirestore(data: Message): DbMessage {
      return data.repliesCount && data.lastReplyAt ? {
        repliesCount: data.repliesCount,
        lastReplyAt: data.lastReplyAt,
        message: data.message,
        from: data.from || '',
        timestamp: getUtcTimestampFromDate(data.created!),
        reactions: data.reactions || []
      } :
      {
        message: data.message,
        from: data.from || '',
        timestamp: data.timestamp,
        reactions: data.reactions || []
      }
    },
    fromFirestore(snap: QueryDocumentSnapshot<DbMessage, Message>): Message {
      let createdDate = new Date(snap.data().timestamp);
      return snap.data().repliesCount ? {
        id: snap.id,
        kind: 'message',
        path: getPathFromSnap(snap) as Message['path'],
        repliesCount: snap.data().repliesCount,
        lastReplyAt: snap.data().lastReplyAt,
        converter: converters.message,
        date: createdDate.toLocaleDateString(),
        message: snap.data().message,
        timestamp: snap.data().timestamp,
        reactions: snap.data().reactions,
        created: createdDate
      } :
      {
        id: snap.id,
        kind: 'message',
        path: getPathFromSnap(snap) as Message['path'],
        converter: converters.message,
        date: createdDate.toLocaleDateString(),
        message: snap.data().message,
        timestamp: snap.data().timestamp,
        reactions: snap.data().reactions,
        created: createdDate
      }
    },
  },
  reply: {
    toFirestore(data: Reply): DbReply {
      return {
        message: data.message,
        from: data.from || '',
        timestamp: getUtcTimestampFromDate(data.created!),
        reactions: data.reactions || []
      }
    },
    fromFirestore(snap: QueryDocumentSnapshot<DbReply>): Reply {
      return {
        id: snap.id,
        kind: 'reply',
        path: getPathFromSnap(snap) as Reply['path'],
        converter: converters.message,
        message: snap.data().message,
        timestamp: snap.data().timestamp,
        reactions: snap.data().reactions,
        created: new Date(snap.data().timestamp)
      }
    }
  }
}
export default converters