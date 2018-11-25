import { TurnContext, ConversationState, StatePropertyAccessor } from "botbuilder";
import { PersonState } from "./schema";

export class PeopleBot {
    private readonly _conversationState: ConversationState;
    private _state: StatePropertyAccessor<PersonState>;
    constructor(conversationState: ConversationState) {
        this._conversationState = conversationState;
        this._state = this._conversationState.createProperty<PersonState>("person");
    }
    async onTurn(context: TurnContext) {
        if (context.activity.type === "message") {
            if (context.activity.text.toLowerCase() === "quit") {
                process.exit();
            } else if (context.activity.text) {
                let currentState = await this._state.get(context);
                if(currentState.pos == null) {
                    currentState.pos = "startConvo";
                }
                if(currentState.pos === "startConvo") {
                    currentState.pos = "askNickname";
                    await context.sendActivity("Hello! What is your name?");
                }
                else if(currentState.pos === "askNickname") {
                    currentState.pos = "askAge";
                    currentState.name = context.activity.text;
                    await context.sendActivity(`Hello, ${currentState.name}! What is your nickname?`);
                }
                else if(currentState.pos === "askAge") {
                    currentState.pos = "askSuperhero";
                    currentState.age = parseInt(context.activity.text);
                    await context.sendActivity(`Great, ${currentState.nickname}! How old are you?`);
                }
                else if(currentState.pos === "askSuperhero") {
                    currentState.pos = "endConvo";
                    currentState.superhero = context.activity.text;
                    await context.sendActivity("What is your favorite superhero?");
                }
                else if(currentState.pos === "endConvo") {
                    currentState.pos = "echo";
                    await context.sendActivity("Go ahead and type some stuff. I'll echo it back!");
                }
                else {
                    await context.sendActivity(`${currentState.name}, you said "${context.activity.text}"`);
                }
                this._state.set(context, currentState);
            }
        }
    }
}
