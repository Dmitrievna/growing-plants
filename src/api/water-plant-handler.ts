
import { loadPlant, savePlant } from "../persistence/plant-repo";
import { waterPlant } from "../domain/plant";
import { publishEvents } from "../events/event-publisher";

export const handler = async (event: any) => {
    const plantId = event.pathParameters.plantId

    const plant = await loadPlant(plantId);
    const result = waterPlant(plant);

    await savePlant(result.updatedPlant);
    await publishEvents(result.events);

    return {
        statusCode: 200
    }
}