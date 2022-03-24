var AWS = require('aws-sdk');
// Set region
var region =process.env.region
AWS.config.update({ region: process.env.region });
const sqs = new AWS.SQS({apiVersion: '2012-11-05'});

exports.handler = async (event, context) => {
  try {
    var boardName = JSON.parse(event.body).boardName
    const sts = new AWS.STS()
    var data = await putAMessageInQueue(context,boardName)
    return {
      statusCode: 200,
      body: JSON.stringify(data)
    }
  }

  //return error when try doesn't work
  catch (e) {
    console.log("error: " + e)
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': event.headers.origin || ""
      },
      body: { message: "Something went wrong : " + e },
    }
  }
}
async function putAMessageInQueue(context,boardName){
    const accountId = context.invokedFunctionArn.split(":")[4];
    const queueName = process.env.boardQueueName
    const queueUrl = `https://sqs.${region}.amazonaws.com/${accountId}/${queueName}`;
    const params = {
        MessageBody: "test message",
        MessageAttributes: {
            "boardName": {
              DataType: "String",
              StringValue: boardName
            }
        },
        QueueUrl: queueUrl,
    };
    try{ 
        return await sqs.sendMessage(params).promise()
        
    }
    catch(err){
        throw "failed to send message to sqs" + err
    }
}