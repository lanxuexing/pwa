import { USER_SUBSCRIPTIONS } from './in-memory-db';
const webpush = require('web-push');


export function sendNewsletter(req, res) {
    console.log('订阅总数', USER_SUBSCRIPTIONS.length);

    const notificationPayload = {
        notification: {
            title: 'Angular消息推送',
            body: '重磅消息!',
            icon: 'https://avatars0.githubusercontent.com/u/20652750?s=460&u=f551621c2f65663d6177cb3a7575c8e9eb1b0e47&v=4',
            vibrate: [100, 50, 100],
            data: {
                dateOfArrival: Date.now(),
                primaryKey: 1
            },
            actions: [{
                action: '探索未知之谜',
                title: '前往网站'
            }]
        }
    };


    Promise.all(USER_SUBSCRIPTIONS.map(sub => {
        console.log('准备推送: ', sub);
        return webpush.sendNotification(sub, JSON.stringify(notificationPayload));
    }))
        .then(() => res.status(200).json({ message: '✅消息已成功推送.' }))
        .catch(err => {
            console.error('❌发送通知时出错，原因: ', err);
            res.sendStatus(500);
        });


}

