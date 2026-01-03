import { DomainEvent } from '../events/domain-events';


export const handler = async (event: any) => {
    for (const record of event.Records) {
        const domainEvent = JSON.parse(record.body);
        console.log(`Plant event received: ${domainEvent.type}`);
    }
}