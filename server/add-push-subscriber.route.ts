import { USER_SUBSCRIPTIONS } from './in-memory-db';


export function addPushSubscriber(req, res) {
    const sub = req.body;
    console.log('🎉在服务器上收到订阅: ', sub);
    USER_SUBSCRIPTIONS.push(sub);
    res.status(200).json({ message: '🍺订阅已成功添加.' });
}

