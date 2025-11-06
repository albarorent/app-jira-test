import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Comment {
  id: string;
  ticketId: string;
  author: string;
  text: string;
  date: string;
}

interface Notification {
  id: string;
  to: string;
  message: string;
  ticketId: string;
  date: string;
  seen: boolean;
}

interface StateCommentStore {
  comments: Comment[];
  notifications: Notification[];
}

interface ActionsCommentStore {
  addComment: (
    ticketId: string,
    author: string,
    text: string,
    detectMentions?: boolean,
  ) => void;
  getComments: (ticketId: string) => Comment[];
  getNotifications: (forEmail: string) => Notification[];
  markNotificationSeen: (notifId: string) => void;
}

export const useCommentStore = create<StateCommentStore & ActionsCommentStore>()(
  persist(
    (set, get) => ({
      comments: [],
      notifications: [],
      addComment: (ticketId, author, text, detectMentions = true) => {
        const date = new Date().toISOString();
        const comment = {
          id: Date.now().toString(),
          ticketId,
          author,
          text,
          date,
        };
        set(state => ({ comments: [...state.comments, comment] }));

        if (detectMentions) {
          const mentionPattern = /@([\w.\-@]+)/g;
          const mentions = [...text.matchAll(mentionPattern)]
            .map(m => m[1])
            .filter(e => e !== author);
          if (mentions.length) {
            const newNotifs = mentions.map(email => ({
              id: `notif-${Date.now()}-${Math.random()}`,
              to: email,
              message: `${author} te mencionó en el ticket: "${text}"`,
              ticketId,
              date,
              seen: false,
            }));
            set(state => ({
              notifications: [...state.notifications, ...newNotifs],
            }));
          }
        }
      },
      getComments: ticketId =>
        get()
          .comments.filter(c => c.ticketId === ticketId)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
      getNotifications: forEmail =>
        get().notifications.filter(n => n.to === forEmail),
      markNotificationSeen: notifId =>
        set(state => ({
          notifications: state.notifications.map(n =>
            n.id === notifId ? { ...n, seen: true } : n,
          ),
        })),
    }),
    {
      name: 'comment-store', // nombre de la clave en AsyncStorage
      storage: {
        getItem: async (name) => {
          const value = await AsyncStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: async (name, value) => {
          await AsyncStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: async (name) => {
          await AsyncStorage.removeItem(name);
        },
      },
    }
  )
);