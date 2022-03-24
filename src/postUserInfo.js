var AWS = require('aws-sdk');
// Set region
AWS.config.update({ region: process.env.region });

exports.handler = async (event, context) => {
  try {
    var name = JSON.parse(event.body).name
    var email = JSON.parse(event.body).email
    // console.log(name)
    const sts = new AWS.STS()
    const { Account: awsAccount } = await sts.getCallerIdentity().promise();
    const topicArn = `arn:aws:sns:${process.env.region}:${awsAccount}:${ process.env.topicName }`
    var params = {
      Message: 'user info',
      Subject: JSON.stringify({name,email}),
      TopicArn: topicArn
    };
    // console.log(JSON.stringify(params))
    // Create promise and SNS service object
    const sns = new AWS.SNS()
    let data = await sns.publish(params).promise();
    console.log(data)
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