import index from './index';

async function handler(req, res) {
  return index(req, res, 2);
}

export default handler;
