var AWS = require('aws-sdk');
// Set region
AWS.config.update({ region: process.env.region });
var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
const { v4: uuid } = require('uuid');

exports.handler = async (event, context) => {
  try {
    var name = JSON.parse(event.Records[0].Sns.Subject).name
    var email = JSON.parse(event.Records[0].Sns.Subject).email
    var userId = uuid()
    var params = {
      TableName: 'usersTable',
      Item :{
        name: { S: name },
        email: {S: email},
        userId: {S: userId}
      }
    };
    await ddb.putItem(params).promise()
    console.log("userId: "+userId)
    return
  }

//return error when try doesn't work
  catch(e)
  {

    console.log("error: "+ e)
    return 
  }
}

