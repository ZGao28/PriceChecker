exports.handler = (event, context) => {

  try {

    if (event.session.new) {
      // New Session
      console.log("NEW SESSION")
    }

    switch (event.request.type) {

      case "LaunchRequest":
        // Launch Request
        console.log(`LAUNCH REQUEST`)
        require('http').get('http://127.0.0.1:3000/items/alexa', (res) => {
          res.setEncoding('utf8');
          res.on('data', (body) => {
              getItems('['+body.slice(1)+']');
          });
        });

        let getItems = (data) => {
            let items = JSON.parse(data);
            let response = 'Here is a list of your items! ';
            for (let i = 0; i < items.length; i++){
                response += items[i].itemName + ' is currently at ' + items[i].lowestPrice + ' ' + items[i].currency + '. '; 
            }
            context.succeed(
              generateResponse(
                buildSpeechletResponse(response, true),
                {}
              )
            )
        }
        break;

      case "IntentRequest":
        // Intent Request
        console.log(`INTENT REQUEST`)
        break;

      case "SessionEndedRequest":
        // Session Ended Request
        console.log(`SESSION ENDED REQUEST`)
        break;

      default:
        context.fail(`INVALID REQUEST TYPE: ${event.request.type}`)

    }

  } catch(error) { context.fail(`Exception: ${error}`) }

}

// Helpers
buildSpeechletResponse = (outputText, shouldEndSession) => {

  return {
    outputSpeech: {
      type: "PlainText",
      text: outputText
    },
    shouldEndSession: shouldEndSession
  }

}

generateResponse = (speechletResponse, sessionAttributes) => {

  return {
    version: "1.0",
    sessionAttributes: sessionAttributes,
    response: speechletResponse
  }

}