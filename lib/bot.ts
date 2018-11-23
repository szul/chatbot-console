import { TurnContext } from "botbuilder";

export class PeopleBot {
    async onTurn(context: TurnContext) {
        if (context.activity.type === "message") {
            if (context.activity.text.toLowerCase() === "quit") {
                process.exit();
            } else if (context.activity.text.toLowerCase() === "hello") {
                //
            } else if (context.activity.text) {
                //
            }
        }
    }
}
