var AWS = require('aws-sdk');
// Set region
AWS.config.update({ region: process.env.region });
var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
const { v4: uuid } = require('uuid');

exports.handler = async (event, context) => {
  try {
    var boardName = event.Records[0].messageAttributes.boardName.stringValue
    var params = {
      TableName: 'boardsTable',
      Item :{
        boardName: { S: boardName }
      }
    };
    await ddb.putItem(params).promise()
    return
  }

//return error when try doesn't work
  catch(e)
  {

    console.log("error: "+ e)
    return 
  }
}

