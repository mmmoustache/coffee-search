import { PropsWithChildren } from 'react';
import { MessageType, getMessageType } from '@/utils/getMessageType';

type Props = {
  type?: MessageType;
};

export function Message({ children, type = 'error' }: PropsWithChildren<Props>) {
  const status = getMessageType(type);
  return (
    <p
      className={`fixed flex gap-3 z-20 bottom-4 right-4 p-4 ml-4 font-small border-2 max-w-2xl bg-white animate-bounce-in | ${status.borderColor}`}
      role="alert"
    >
      <svg
        className="icon"
        width="1.25em"
        height="1.25em"
        fill="currentColor"
      >
        <use xlinkHref={`/icons/icons.svg#${status.icon}`} />
      </svg>
      {children}
    </p>
  );
}
