import dynamic from 'next/dynamic';
import propTypes from 'prop-types';

const Picker = dynamic(() => import('emoji-picker-react'), { ssr: false });

const Emoji = ({ setEmoji }) => {
  const onEmojiSelect = (_, emoji) => setEmoji(emoji);

  return (
    <Picker
      onEmojiClick={onEmojiSelect}
      skinTone="1f3fb"
      groupNames={{ smileys_people: 'PEOPLE' }}
      native
      disableAutoFocus
      disableSearchBar
      disableSkinTonePicker
    />
  );
}

Emoji.propTypes = {
  setEmoji: propTypes.func.isRequired,
};

export default Emoji;
