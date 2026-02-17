import { PropsWithChildren } from 'react';
import { MessageType, getMessageType } from '@/utils/getMessageType';

type Props = {
  type?: MessageType;
};

export function Message({ children, type = 'error' }: PropsWithChildren<Props>) {
  const status = getMessageType(type);
  return (
    <p
      className={`fixed bottom-4 left-4 p-4 font-body drop-shadow-zinc-950 border bg-white rounded-md | ${status.borderColor}`}
      role="alert"
    >
      {children}
    </p>
  );
}
