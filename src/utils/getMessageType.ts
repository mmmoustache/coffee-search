export const messageTypes = {
  error: {
    backgroundColor: 'bg-red-500',
    borderColor: 'bg-red-500',
    textColor: 'text-black',
  },
  success: {
    backgroundColor: 'bg-green-500',
    borderColor: 'bg-green-500',
    textColor: 'text-white',
  },
  warning: {
    backgroundColor: 'bg-yellow-400',
    borderColor: 'bg-yellow-400',
    textColor: 'text-black',
  },
} as const;

export type MessageType = keyof typeof messageTypes;

export function getMessageType<T extends MessageType>(type: T) {
  return messageTypes[type];
}
