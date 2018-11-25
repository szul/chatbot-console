import { TurnContext, MemoryStorage, ConversationState } from "botbuilder";
import { ConsoleAdapter} from "./consoleAdapter";
import { PeopleBot } from "./bot";

const adapter: ConsoleAdapter = new ConsoleAdapter();
const conversationState = new ConversationState(new MemoryStorage());
const bot: PeopleBot = new PeopleBot(conversationState);

adapter.listen(async (context: TurnContext) => {
    console.log(`PeopleBot is running. Type "hello" to start. Type "quit" to exit.`);
    await bot.onTurn(context);
});
