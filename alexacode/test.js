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