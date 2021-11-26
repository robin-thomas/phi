import index from './index';

async function handler(req, res) {
  return index(req, res, 3);
}

export default handler;
