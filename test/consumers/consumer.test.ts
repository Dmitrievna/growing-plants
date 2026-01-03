import { loadPlant, savePlant } from "../../src/persistence/plant-repo";
import { publishEvents } from "../../src/events/event-publisher";
import { handler } from "../../src/api/water-plant-handler";
import { jest, describe, it } from "@jest/globals";

jest.mock('../../src/persistence/plant-repo', () => ({
  loadPlant: jest.fn(),
  savePlant: jest.fn()
}));

jest.mock('../../src/events/event-publisher', () => ({
  publishEvents: jest.fn()
}));



describe('handler', () => {
  it('waters plant and persists changes', async () => {

    (loadPlant as jest.MockedFunction<typeof loadPlant>).mockResolvedValue({
      plantId: 'plant1',
      hydrationLevel: 40,
      lastWatered: new Date('2024-01-01T00:00:00Z'),
      status: 'ALIVE'
    });

    const response = await handler({
      pathParameters: { plantId: 'plant1' }
    });

    // Assert
    expect(loadPlant).toHaveBeenCalledWith('plant1');
    expect(savePlant).toHaveBeenCalledTimes(1);
    expect(publishEvents).toHaveBeenCalledTimes(1);
    expect(response.statusCode).toBe(200);
  });
});