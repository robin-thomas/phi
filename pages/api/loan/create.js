import index from './index';

async function handler(req, res) {
  return index(req, res, 0);
}

export default handler;
