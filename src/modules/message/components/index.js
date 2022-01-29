import { useRef, useEffect } from 'react';

import SimpleBar from 'simplebar-react';

import Message from './Message';
import Skeleton from './Skeleton';

const Messages = ({ chats }) => {
  const ref = useRef();

  const scrollToBottom = () => {
    ref.current.recalculate();
    ref.current.getScrollElement().scrollTo({ top: ref.current.getScrollElement().scrollHeight, behavior: 'smooth' });
  }

  useEffect(() => {
    setTimeout(scrollToBottom, 500);
  }, [chats]);

  return (
    <SimpleBar ref={ref} style={{ height: '100%' }}>
      {chats === null ? (
        <Skeleton />
      ) :
        chats.map(chat => <Message key={chat._id} chat={chat} />)
      }
    </SimpleBar>
  )
}

export { default as Skeleton } from './Skeleton';
export default Messages;
