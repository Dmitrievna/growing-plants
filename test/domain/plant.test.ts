import { Plant, waterPlant } from "../../src/domain/plant";
import { it, describe, expect } from '@jest/globals';

describe('Plant domain logic tests', () => {

    it('waterPlant increases hydration level and returns PlantWatered event', () => {

    const plant = {
    plantId : 'fern-1',
    hydrationLevel: 40,
    lastWatered: new Date(),
    status: 'DRY'
  } as Plant;

  const result = waterPlant(plant)

  expect(result.updatedPlant.hydrationLevel).toBeGreaterThan(40)
  expect(result.events[0].type).toBe('PlantWatered')


    });

})