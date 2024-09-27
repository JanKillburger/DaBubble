import { QueryDocumentSnapshot } from "@angular/fire/firestore";
import { ChannelData, Message } from "./firebase-channel.service";
import { UserData } from "./firebase-user.service";

const converters = {
    message: {
        toFirestore: (data: Message) => {
          delete data.created;
          return data;
        },
        fromFirestore: (snap: QueryDocumentSnapshot) => {
          const rawData = snap.data();
          rawData['created'] = new Date(snap.data()['timestamp']);
          return rawData as Message;
        },
      },
      user: {
        toFirestore: (data: UserData) => data,
        fromFirestore: (snap: QueryDocumentSnapshot) => {
          return snap.data() as UserData;
        },
      },
      channel: {
        toFirestore: (data: ChannelData) => data,
        fromFirestore: (snap: QueryDocumentSnapshot) => {
          snap.data()['id'] = snap.id;
          return snap.data() as ChannelData;
        },
      }
}
export default converters