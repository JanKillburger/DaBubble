import { Component, inject } from '@angular/core';
import { doc, Firestore, setDoc } from '@angular/fire/firestore';
import { DbChat } from '../models/app.model';

const guestUserId = 'AOEZ2vVTjHSxNTpoeDeqgv63hJu2';

const USERS: {
  id?: string;
  name: string;
  email: string;
  avatar: string;
  isOnline: boolean;
  channelIds: string[];
}[] = [
  {
    id: '1',
    name: 'Anna',
    email: 'anna@example.com',
    avatar: './assets/img/login/signin/avatar1.png',
    isOnline: true,
    channelIds: ['1'],
  },
  {
    id: '2',
    name: 'Jonas',
    email: 'jonas@example.com',
    avatar: './assets/img/login/signin/avatar3.png',
    isOnline: true,
    channelIds: ['1'],
  },
  {
    id: '3',
    name: 'Laura',
    email: 'laura@example.com',
    avatar: './assets/img/login/signin/avatar5.png',
    isOnline: false,
    channelIds: ['1'],
  },
  {
    id: '4',
    name: 'Tobias',
    email: 'tobias@example.com',
    avatar: './assets/img/login/signin/avatar2.png',
    isOnline: true,
    channelIds: ['2'],
  },
  {
    id: '5',
    name: 'IT-Support',
    email: 'it-support@example.com',
    avatar: './assets/img/login/signin/avatar4.png',
    isOnline: true,
    channelIds: ['2'],
  },
  {
    id: '6',
    name: 'Sophie',
    email: 'sophie@example.com',
    avatar: './assets/img/login/signin/avatar1.png',
    isOnline: true,
    channelIds: ['3'],
  },
  {
    id: '7',
    name: 'Markus',
    email: 'markus@example.com',
    avatar: './assets/img/login/signin/avatar3.png',
    isOnline: false,
    channelIds: ['3'],
  },
  {
    id: '8',
    name: 'Nina',
    email: 'nina@example.com',
    avatar: './assets/img/login/signin/avatar5.png',
    isOnline: true,
    channelIds: ['4'],
  },
  {
    id: '9',
    name: 'HR-Team',
    email: 'hr-team@example.com',
    avatar: './assets/img/login/signin/avatar4.png',
    isOnline: true,
    channelIds: ['4'],
  },
  {
    id: guestUserId,
    name: 'Gast',
    email: 'guest@example.com',
    avatar: './assets/img/login/signin/avatar2.png',
    isOnline: true,
    channelIds: ['1', '2', '3', '4', 'AllUsersChannel'],
  },
];

const CHATS: DbChat[] = [
  {
    userIds: [guestUserId],
    participants: {guestUserId: {name: "Gast", id: guestUserId}}
  },
  {
    userIds: [guestUserId, "1"],
    participants: {
      guestUserId: {name: "Gast", id: guestUserId},
      "1": {id: "1", name: "Anna"}
    }
  }
]

const CHANNELS: {
  id?: string;
  createdBy: string;
  description: string;
  name: string;
  userIds: string[];
  previewUsers: { id: string; avatar: string }[] | null;
  previewUserIds: string[];
}[] = [
  {
    id: '1',
    createdBy: 'Anna',
    description: 'Diskussionen und Updates rund um das Marketing-Team.',
    name: 'Marketing',
    userIds: ['1', '2', '3', guestUserId],
    previewUsers: [
      { id: '1', avatar: './assets/img/login/signin/avatar1.png' },
      { id: '2', avatar: './assets/img/login/signin/avatar3.png' },
      { id: '3', avatar: './assets/img/login/signin/avatar5.png' },
    ],
    previewUserIds: ['1', '2', '3'],
  },
  {
    id: '2',
    createdBy: 'Tobias',
    description: 'IT-Support-Channel für technische Anfragen und Hilfe.',
    name: 'IT-Support',
    userIds: ['4', '5', guestUserId],
    previewUsers: [
      { id: '4', avatar: './assets/img/login/signin/avatar2.png' },
      { id: '5', avatar: './assets/img/login/signin/avatar4.png' },
    ],
    previewUserIds: ['4', '5'],
  },
  {
    id: '3',
    createdBy: 'Sophie',
    description: 'Austausch über Projekte und Neuigkeiten im Vertriebsteam.',
    name: 'Vertrieb',
    userIds: ['6', '7', guestUserId],
    previewUsers: [
      { id: '6', avatar: './assets/img/login/signin/avatar1.png' },
      { id: '7', avatar: './assets/img/login/signin/avatar3.png' },
    ],
    previewUserIds: ['6', '7'],
  },
  {
    id: '4',
    createdBy: 'Nina',
    description: 'Personalabteilung für interne Fragen und Informationen.',
    name: 'HR',
    userIds: ['8', '9', guestUserId],
    previewUsers: [
      { id: '8', avatar: './assets/img/login/signin/avatar5.png' },
      { id: '9', avatar: './assets/img/login/signin/avatar4.png' },
    ],
    previewUserIds: ['8', '9'],
  },
  {
    id: 'AllUsersChannel',
    createdBy: 'Admin',
    description: 'All new users are added to this channel',
    name: 'Welcome',
    previewUserIds: ['1', '2', '3'],
    previewUsers: [
      {
        avatar: './assets/img/login/signin/avatar1.png',
        id: '1',
      },
      { avatar: './assets/img/login/signin/avatar3.png', id: '2' },
      { avatar: './assets/img/login/signin/avatar5.png', id: '5' },
    ],
    userIds: ['1', '2', '3', '4', '5', '6', '7', '8', '9', guestUserId],
  },
];

const MESSAGES: {
  channelId: string;
  messages: {
    id?: string;
    message: string;
    from: string;
    timestamp: number;
    reactions: {
      emoji: string;
      userId: string[];
    }[];
    repliesCount?: number;
    lastReplyAt?: number;
  }[];
}[] = [
  {
    channelId: '1',
    messages: [
      {
        id: 'm1',
        message: 'Wie läuft die Planung der neuen Kampagne?',
        from: '3',
        timestamp: 1672531200000,
        reactions: [
          {
            emoji: '👍',
            userId: ['1'],
          },
        ],
        repliesCount: 2,
        lastReplyAt: 1672539600000,
      },
      {
        id: 'm2',
        message: 'Habt ihr schon einen Plan für die Zielgruppenansprache?',
        from: '2',
        timestamp: 1672534800000,
        reactions: [
          {
            emoji: '❤️',
            userId: ['1'],
          },
        ],
        repliesCount: 1,
        lastReplyAt: 1672538500000,
      },
      {
        id: 'm3',
        message: 'Welche Tools nutzen wir für die Analyse der Kampagne?',
        from: guestUserId,
        timestamp: 1672538400000,
        reactions: [
          {
            emoji: '👍',
            userId: ['1'],
          },
        ],
      },
    ],
  },
  {
    channelId: '2',
    messages: [
      {
        id: 'm4',
        message: 'Gibt es bereits ein Update zu den Serverproblemen?',
        from: '4',
        timestamp: 1672532200000,
        reactions: [
          {
            emoji: '👍',
            userId: ['5'],
          },
        ],
        repliesCount: 1,
        lastReplyAt: 1672535500000,
      },
      {
        id: 'm5',
        message: 'Wie steht es um die Sicherheitslücken im Netzwerk?',
        from: '5',
        timestamp: 1672536000000,
        reactions: [
          {
            emoji: '💡',
            userId: ['4'],
          },
        ],
      },
      {
        id: 'm6',
        message: 'Wurde die Firewall-Konfiguration überprüft?',
        from: guestUserId,
        timestamp: 1672538200000,
        reactions: [
          {
            emoji: '👍',
            userId: ['4'],
          },
        ],
      },
    ],
  },
  {
    channelId: '3',
    messages: [
      {
        id: 'm7',
        message: 'Haben wir das Quartalsziel schon erreicht?',
        from: '6',
        timestamp: 1672540000000,
        reactions: [
          {
            emoji: '🎯',
            userId: ['7'],
          },
        ],
        repliesCount: 2,
        lastReplyAt: 1672543600000,
      },
      {
        id: 'm8',
        message: 'Wie sehen die Verkaufszahlen im Norden aus?',
        from: '7',
        timestamp: 1672542000000,
        reactions: [
          {
            emoji: '📈',
            userId: ['6'],
          },
        ],
      },
      {
        id: 'm9',
        message: 'Gibt es Neuigkeiten zu den Verhandlungen mit Kunde X?',
        from: guestUserId,
        timestamp: 1672545000000,
        reactions: [
          {
            emoji: '🤝',
            userId: ['7'],
          },
        ],
      },
    ],
  },
  {
    channelId: '4',
    messages: [
      {
        id: 'm10',
        message:
          'Gibt es Neuigkeiten zum Bewerbungsprozess für die neue Stelle?',
        from: '8',
        timestamp: 1672548000000,
        reactions: [
          {
            emoji: '✅',
            userId: ['9'],
          },
        ],
        repliesCount: 1,
        lastReplyAt: 1672549000000,
      },
      {
        id: 'm11',
        message: 'Wann planen wir das nächste Team-Event?',
        from: '9',
        timestamp: 1672550000000,
        reactions: [
          {
            emoji: '🎉',
            userId: ['8'],
          },
        ],
        repliesCount: 2,
        lastReplyAt: 1672551800000,
      },
      {
        id: 'm12',
        message: 'Sind die Verträge für die neuen Mitarbeiter schon bereit?',
        from: guestUserId,
        timestamp: 1672554000000,
        reactions: [
          {
            emoji: '✍️',
            userId: ['8'],
          },
        ],
      },
    ],
  },
];

const REPLIES: {
  channelId: string;
  messageId: string;
  replies: {
    id?: string;
    message: string;
    from: string;
    timestamp: number;
    reactions: {
      emoji: string;
      userId: string[];
    }[];
  }[];
}[] = [
  {
    channelId: '1',
    messageId: 'm1',
    replies: [
      {
        id: 'r1',
        message:
          'Wir sind noch in der Planungsphase, aber die ersten Ideen stehen.',
        from: '1',
        timestamp: 1672531600000,
        reactions: [],
      },
      {
        id: 'r2',
        message:
          'Die Budgetplanung ist fast abgeschlossen, wir können bald starten.',
        from: '2',
        timestamp: 1672539600000,
        reactions: [
          {
            emoji: '👍',
            userId: ['3'],
          },
        ],
      },
    ],
  },
  {
    channelId: '1',
    messageId: 'm2',
    replies: [
      {
        id: 'r3',
        message:
          'Wir sollten noch eine Umfrage unter der Zielgruppe durchführen, um mehr Insights zu bekommen.',
        from: guestUserId,
        timestamp: 1672537500000,
        reactions: [],
      },
    ],
  },
  {
    channelId: '2',
    messageId: 'm4',
    replies: [
      {
        id: 'r4',
        message: 'Die Probleme sind fast behoben, es läuft jetzt stabil.',
        from: '5',
        timestamp: 1672535500000,
        reactions: [],
      },
    ],
  },
  {
    channelId: '3',
    messageId: 'm7',
    replies: [
      {
        id: 'r5',
        message: 'Noch nicht ganz, wir liegen bei etwa 90%.',
        from: '7',
        timestamp: 1672542000000,
        reactions: [],
      },
      {
        id: 'r6',
        message:
          'Mit ein paar Abschlüssen diese Woche könnten wir es schaffen.',
        from: guestUserId,
        timestamp: 1672543600000,
        reactions: [
          {
            emoji: '💪',
            userId: ['6'],
          },
        ],
      },
    ],
  },
  {
    channelId: '4',
    messageId: 'm10',
    replies: [
      {
        id: 'r7',
        message: 'Ja, wir haben bereits die ersten Gespräche geführt.',
        from: '9',
        timestamp: 1672549000000,
        reactions: [
          {
            emoji: '👍',
            userId: ['8'],
          },
        ],
      },
    ],
  },
  {
    channelId: '4',
    messageId: 'm11',
    replies: [
      {
        id: 'r8',
        message:
          'Ich schlage Mitte nächsten Monats vor, um genügend Vorbereitungszeit zu haben.',
        from: '8',
        timestamp: 1672551000000,
        reactions: [],
      },
      {
        id: 'r9',
        message: 'Klingt gut, ich werde einen Vorschlag erstellen.',
        from: guestUserId,
        timestamp: 1672551800000,
        reactions: [
          {
            emoji: '💡',
            userId: ['9'],
          },
        ],
      },
    ],
  },
];

@Component({
  selector: 'app-upload-json',
  standalone: true,
  imports: [],
  templateUrl: './upload-json.component.html',
  styleUrl: './upload-json.component.scss',
})
export class UploadJsonComponent {
  fs = inject(Firestore);

  saveUserProfiles() {
    USERS.forEach((user) => {
      const id = user.id!;
      delete user.id;
      setDoc(doc(this.fs, 'users', id), user);
    });
  }

  saveChats() {
    CHATS.forEach((chat) => {
      setDoc(doc(this.fs, 'chats'), chat)
    })
  }

  saveChannels() {
    CHANNELS.forEach((channel) => {
      const id = channel.id!;
      delete channel.id;
      setDoc(doc(this.fs, 'channels', id), channel);
    });
  }

  saveMessages() {
    MESSAGES.forEach((channel) => {
      channel.messages.forEach((message) => {
        const id = message.id!;
        delete message.id;
        setDoc(
          doc(this.fs, 'channels', channel.channelId, 'messages', id),
          message
        );
      });
    });
  }

  saveReplies() {
    REPLIES.forEach((item) => {
      item.replies.forEach((message) => {
        const id = message.id!;
        delete message.id;
        setDoc(
          doc(
            this.fs,
            'channels',
            item.channelId,
            'messages',
            item.messageId,
            'replies',
            id
          ),
          message
        );
      });
    });
  }
}
