import { PropsWithChildren } from 'react';
import { MessageType, getMessageType } from '@/utils/getMessageType';

type Props = {
  type?: MessageType;
};

export function Message({ children, type = 'error' }: PropsWithChildren<Props>) {
  const status = getMessageType(type);
  return (
    <p
      className={`fixed bottom-0 left-0 w-full p-4 | ${status.backgroundColor}`}
      role="alert"
    >
      {children}
    </p>
  );
}
