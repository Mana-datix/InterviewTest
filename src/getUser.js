var AWS = require('aws-sdk');
// Set region
AWS.config.update({ region: process.env.region });
var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

exports.handler = async (event, context) => {
  try {
    var email = event.pathParameters.email
    var params = {
        TableName: 'usersTable',
        Key: {
            'email': {S: email}
        },
    };   
    data = await ddb.getItem(params).promise()
    var userInfo ={name:data.Item.name.S,
                    email: data.Item.email.S,
                    userId: data.Item.userId.S}
    return {
        statusCode: 200,
        body: JSON.stringify(userInfo)
      }
  }

//return error when try doesn't work
  catch(e)
  {

    console.log("error: "+ e)
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

