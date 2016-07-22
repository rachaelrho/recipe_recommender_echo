/**
    Copyright 2014-2015 Amazon.com, Inc. or its affiliates. All Rights Reserved.

    Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at

        http://aws.amazon.com/apache2.0/

    or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

/**
 * This sample shows how to create a Lambda function for handling Alexa Skill requests that:
 *
 * - Custom slot type: demonstrates using custom slot types to handle a finite set of known values
 *
 * Examples:
 * One-shot model:
 *  User: "Alexa, ask Minecraft Helper how to make paper."
 *  Alexa: "(reads back recipe for paper)"
 */

'use strict';

//var KEY_CURRENT_INDEX = "current"; 

var AlexaSkill = require('./AlexaSkill'),
    instructions = require('./instructions'),
    recipes = require('./recipes');

var APP_ID = undefined; //replace with 'amzn1.echo-sdk-ams.app.[your-unique-value-here]';

/**
 * MinecraftHelper is a child of AlexaSkill.
 * To read more about inheritance in JavaScript, see the link below.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript#Inheritance
 */
var IngredientHelper = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
IngredientHelper.prototype = Object.create(AlexaSkill.prototype);
IngredientHelper.prototype.constructor = IngredientHelper;

IngredientHelper.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {

    console.log("Ingredient Helper onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId); //added from wiseguy skill

    var speechText = "Welcome to the Ingredient Helper! You can get recipe suggestions personalized to your ingredients and pre-programmed nutritional preferences. ... Now, what can I help you with?";
    //(full text)You can get recipe suggestions personalized to your ingredients and pre-programmed nutritional preferences. You can ask a question like, what can I make with almonds, dates and cocoa powder? ... Now, what can I help you with.

    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.
    var repromptText = "For instructions on what you can say, please say help me.";
    response.ask(speechText, repromptText);
};




IngredientHelper.prototype.intentHandlers = {
    "RecipeIntent": function (intent, session, response) {

        var itemSlotA = intent.slots.ItemA,
            itemNameA;
        if (itemSlotA && itemSlotA.value){
            itemNameA = itemSlotA.value.toLowerCase();
        }

        var itemSlotB = intent.slots.ItemB, 
            itemNameB;
        if (itemSlotB && itemSlotB.value){
            itemNameB = itemSlotB.value.toLowerCase();
        }

        var itemSlotC = intent.slots.ItemC, 
            itemNameC;
        if (itemSlotC && itemSlotC.value){
            itemNameC = itemSlotC.value.toLowerCase();
        }

        var ingredients = [itemNameA, itemNameB, itemNameC]
            ingredients.sort();

        var cardTitle = "Recipe for " + itemNameA + "," + itemNameB + "," + itemNameC,
            recipe = recipes[ingredients.toString()], //String(ingredients.slice(0,4))
            speechOutput,
            repromptOutput;


        if (recipe) {
            speechOutput = {
                speech: "You can make " + recipe + ". Would you like to hear the instructions?",
                type: AlexaSkill.speechOutputType.PLAIN_TEXT
            };

            session.attributes.stage = 1;
            session.attributes.recipe = recipe;
            session.attributes.instructions = instructions[recipe];




            response.askWithCard(speechOutput, cardTitle, recipe);
        } else {
            var speech;
            if (recipe == 'undefined') {
                speech = "I'm sorry, I currently do not know a recipe with " + String(ingredients.slice(0,2)) + " and " + String(ingredients.slice(2,3)) + ". What else can I help with?";
            } else {
                speech = "I'm sorry, I currently do not know that recipe. What else can I help with?";
            }

            speechOutput = {
                speech: speech,
                type: AlexaSkill.speechOutputType.PLAIN_TEXT
            };
            repromptOutput = {
                speech: "What else can I help with?",
                type: AlexaSkill.speechOutputType.PLAIN_TEXT
            };
            response.ask(speechOutput, repromptOutput);
        }
    },

    "AMAZON.YesIntent": function(intent, session, response) {
        var sessionStage = session.attributes.stage,
            sessionRecipe = session.attributes.recipe,
            sessionInstructions = session.attributes.instructions,
            speechText = "";

        if (typeof sessionInstructions == 'undefined') {  //typeof session.attributes.instructions != 'undefined')
            speechText = "What ingredients would you like to cook with today?";
        } else {
            //for (i = 0; i < instructions[sessionRecipe].length; i++) {
            speechText = "Step " + sessionStage + " is " + instructions[sessionRecipe][sessionStage-1] + ". Would you like to hear the next step?"; 
            session.attributes.stage += 1;
            //}
        }
        
        var speechOutput = {
        speech: speechText,
        type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        response.ask(speechOutput);
        
    },

    "AMAZON.StopIntent": function (intent, session, response) {
        var speechOutput = "Thanks for exploring Ingredient Helper. Goodbye!";
        response.tell(speechOutput);
    },

    "AMAZON.CancelIntent": function (intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    },

    "AMAZON.HelpIntent": function (intent, session, response) {
        var speechText = "You can ask questions on ingredients for personalized recipes such as, what's a good recipe using eggs and avocados, or, you can say exit... Now, what can I help you with?";
        var repromptText = "You can say things like, what can I make with chicken and eggplant, or you can say exit... Now, what can I help you with?";
        var speechOutput = {
            speech: speechText,
            type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        var repromptOutput = {
            speech: repromptText,
            type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        response.ask(speechOutput, repromptOutput);
    }
};

exports.handler = function (event, context) {
    var ingredientHelper = new IngredientHelper();
    ingredientHelper.execute(event, context);
};
