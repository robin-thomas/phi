export const messageGrouper = (chats) => {
  const results = [];

  for (let i = 0; i < chats.length; ++i) {
    const messages = [chats[i].message];
    if (chats[i].attachments.length > 0) {
      results.push({ ...chats[i], messages });
      continue;
    }

    const j = i + 1;
    while (j < chats.length && chats[i].from === chats[j].from) {
      // if differnce between 2 messages are greater than 10 minutes,
      // dont club then together.
      const prev = new Date(chats[i].date).getTime();
      const curr = new Date(chats[j].date).getTime();
      const diff = curr - prev;
      if (diff > (5 * 60 * (10 ** 3))) {
        break;
      }

      messages.push(chats[j].message);
      ++j;
    }

    if (j < chats.length) {
      results.push({ ...chats[i], messages, date: chats[j].date });
    } else {
      results.push({ ...chats[i], messages, date: chats[j - 1].date });
    }

    i = j - 1;
  }

  return results;
}
