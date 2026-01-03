export interface DomainEvent {
    type: 'PlantWatered'|'PlantDriedOut'|'PlantDied';
    payload: unknown;
}