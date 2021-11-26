import { ThreadID } from '@textile/hub';

import { getTextileClient } from '../../../utils/textile/thread';
import schema from '../../../config/schema/loan.json';

async function handler(req, res) {
  if (req.method === 'GET') {
    const loanId = req.query.loanId;

    const thread = req.query.thread;
    const { threadID, dbInfo } = JSON.parse(Buffer.from(thread, 'hex').toString());
    const db = ThreadID.fromString(threadID);

    const client = await getTextileClient();

    try {
      await client.joinFromInfo(dbInfo);
    } catch (err) {}

    await client.updateCollection(db, { name: process.env.TEXTILE_COLLECTION_LOAN, schema });

    const loan = await client.findByID(db, process.env.TEXTILE_COLLECTION_LOAN, loanId);
    loan.modified = Date.now();
    await client.save(db, process.env.TEXTILE_COLLECTION_LOAN, [loan]);

    res.status(200).send({ status: 1 });
  }
}

export default handler;
