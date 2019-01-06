import { TurnContext, MemoryStorage, ConversationState } from "botbuilder";
import { ConsoleAdapter} from "./consoleAdapter";
import { PeopleBot } from "./bot";

const adapter: ConsoleAdapter = new ConsoleAdapter();
const conversationState = new ConversationState(new MemoryStorage());
const bot: PeopleBot = new PeopleBot(conversationState);

adapter.processActivity(async (context: TurnContext) => {
    await bot.onTurn(context);
});

console.log(`PeopleBot is running. Type "hello" to start. Type "quit" to exit.`);
