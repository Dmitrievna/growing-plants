import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigw from 'aws-cdk-lib/aws-apigateway';
import * as subscriptions from 'aws-cdk-lib/aws-sns-subscriptions';

import * as sns_subscriptions from 'aws-cdk-lib/aws-sns-subscriptions';


export class PlantStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // persistence 
        const plantTable = new dynamodb.Table(this, 'PlantTable', {
            partitionKey: { name: 'plantId', type: dynamodb.AttributeType.STRING },
            billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
            removalPolicy: cdk.RemovalPolicy.DESTROY, // it's not for production but be careful
        });

        // events
        const plantEventsTopic = new sns.Topic(this, 'PlantEventsTopic');

        // api lambda 
        const apiLambda = new lambda.Function(this, 'WaterPlantHandler', {
            runtime: lambda.Runtime.NODEJS_18_X,
            handler: 'water-plant.handler',
            code: lambda.Code.fromAsset('src/api'),
            environment: {
                PLANT_TABLE_NAME: plantTable.tableName,
                PLANT_EVENTS_TOPIC_ARN: plantEventsTopic.topicArn
            },
        });

        plantTable.grantReadWriteData(apiLambda);
        plantEventsTopic.grantPublish(apiLambda);

        // api garteway 
        
        const api = new apigw.RestApi(this, 'PlantApi');

        const plants = api.root.addResource('plants');
        const plant = plants.addResource('{plantId}');
        plant.addMethod('POST', new apigw.LambdaIntegration(apiLambda));


        // consumer lambda
        const consumerLambda = new lambda.Function(this, 'PlantEventConsumer', {
            runtime: lambda.Runtime.NODEJS_18_X,    
            handler: 'consumer.handler',
            code: lambda.Code.fromAsset('src/consumers'),
        });

        plantEventsTopic.addSubscription(new subscriptions.LambdaSubscription(consumerLambda));

    }
}