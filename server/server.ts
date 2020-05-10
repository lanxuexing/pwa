
import * as express from 'express';
import { Application } from 'express';
import { readAllLessons } from './read-all-lessons.route';
import { addPushSubscriber } from './add-push-subscriber.route';
import { sendNewsletter } from './send-newsletter.route';
import { USER_SUBSCRIPTIONS } from './in-memory-db';
const bodyParser = require('body-parser');
const webpush = require('web-push');

const vapidKeys = {
    // publicKey: 'BLnVk1MBGFBW4UxL44fuoM2xxQ4o9CuxocVzKn9UVmnXZEyPCTEFjI4sALMB8qN5ee67yZ6MeQWjd5iyS8lINAg',
    // privateKey: 'mp5xYHWtRTyCA63nZMvmJ_qmYO6A1klSotcoppSx-MI'
    publicKey: 'BFdzGBdib94O2_T_Hs3PIONwaSdoiXZSFCT8oT3GVz685xEU_2zsuNyOK-SJ_CNkWyTNHe0m2TYZRiBejxZYCaU',
    privateKey: 'aaZkNtImSfYC4OzDqSfBY4_Ytjz6OyfFtdO9Iw0M9TQ'
};

webpush.setGCMAPIKey('<Your GCM API Key Here>');

webpush.setVapidDetails(
    'mailto:example@yourdomain.org',
    vapidKeys.publicKey,
    vapidKeys.privateKey
);

const app: Application = express();
app.use(bodyParser.json());


app.route('/api/lessons').get(readAllLessons);

app.route('/api/notifications').post(addPushSubscriber);

app.route('/api/newsletter').post(sendNewsletter);

const httpServer: any = app.listen(9000, () => {
    console.log('HTTP Server running at http://localhost:' + httpServer.address().port);
});
