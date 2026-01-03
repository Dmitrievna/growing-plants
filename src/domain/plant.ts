import { DomainEvent } from '../events/domain-events';

export type PlantStatus = 'ALIVE'|'DRY'|'DEAD'

export interface Plant {
    plantId: string;
    hydrationLevel: number; // 0 to 100
    lastWatered: Date;
    status: PlantStatus;
}

export function waterPlant(plant: Plant): {
    updatedPlant: Plant;
    events: DomainEvent[];
} {
    const updated = {
        ...plant,
        hydrationLevel: Math.min(plant.hydrationLevel + 30, 100),
        lastWatered: new Date(),
        status: 'ALIVE'
    } as Plant;

    return {
        updatedPlant: updated,
        events: [{
            type: 'PlantWatered',
            payload: {
                plantId: plant.plantId,
                hydrationLevel: updated.hydrationLevel} 
            }]
    }
}
    