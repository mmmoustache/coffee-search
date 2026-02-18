export const messageTypes = {
  error: {
    backgroundColor: 'bg-red-500',
    borderColor: 'border-red-500',
    textColor: 'text-black',
    icon: 'exclamation-square',
  },
  success: {
    backgroundColor: 'bg-green-500',
    borderColor: 'border-green-500',
    textColor: 'text-white',
    icon: 'check-square',
  },
  warning: {
    backgroundColor: 'bg-yellow-400',
    borderColor: 'border-yellow-400',
    textColor: 'text-black',
    icon: 'info-square',
  },
} as const;

export type MessageType = keyof typeof messageTypes;

export function getMessageType<T extends MessageType>(type: T) {
  return messageTypes[type];
}
