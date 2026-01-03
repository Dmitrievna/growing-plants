import { GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { dynamo } from "./dynamo-client";
import { Plant } from "../domain/plant";

export async function loadPlant(plantId: string): Promise<Plant> {
    const result = await dynamo.send(
        new GetCommand({
            TableName: process.env.PLANTS_TABLE!,
            Key: { plantId }
        })
    )

    if (!result.Item) {
        return  {
            plantId,
            hydrationLevel: 50,
            lastWatered: new Date(0),
            status: 'ALIVE'
        }
    }

    return {
        plantId: result.Item.plantId,
        hydrationLevel: result.Item.hydrationLevel,
        lastWatered: new Date(result.Item.lastWatered),
        status: result.Item.status
    }
}

export async function savePlant(plant: Plant): Promise<void> {
    await dynamo.send(
        new PutCommand({
            TableName: process.env.PLANTS_TABLE!,
            Item: {
                plantId: plant.plantId,
                hydrationLevel: plant.hydrationLevel,
                lastWatered: plant.lastWatered.toISOString(),
                status: plant.status
            }
        })
    )
}