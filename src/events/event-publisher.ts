import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';
import { DomainEvent } from './domain-events';


const snsClient = new SNSClient({})

export async function publishEvents(events: DomainEvent[]) {

    if (!process.env.PLANT_EVENTS_TOPIC) {
        throw new Error('PLANT_EVENTS_TOPIC is not set');
    }

    for (const event in events) {
        await snsClient.send(
            new PublishCommand({
                TopicArn: process.env.PLANT_EVENTS_TOPIC,
                Message: JSON.stringify(event),
            })
        )
    }
}

