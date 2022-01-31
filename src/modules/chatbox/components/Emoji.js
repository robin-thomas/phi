import dynamic from 'next/dynamic';

const Picker = dynamic(() => import('emoji-picker-react'), { ssr: false });

const Emoji = ({ setEmoji }) => {
  const onEmojiSelect = (_, emoji) => setEmoji(emoji);

  return (
    <Picker
      onEmojiClick={onEmojiSelect}
      disableAutoFocus={true}
      skinTone="1f3fb"
      groupNames={{ smileys_people: 'PEOPLE' }}
      native
    />
  );
}

export default Emoji;
