import { Activity, BotAdapter, ConversationReference, ResourceResponse, TurnContext } from "botbuilder";
import { ReadLine, ReadLineOptions, createInterface} from "readline";

export class ConsoleAdapter extends BotAdapter {
    private _nextID: number = 0;
    private readonly _ref: ConversationReference;
    private readonly _lineOptions: ReadLineOptions = {
        input: process.stdin,
        output: process.stdout,
        terminal: false
    }
    constructor() {
        super();
        this._ref = {
            channelId: "console",
            user: { 
                id: "user",
                name: "User"
            },
            bot: {
                id: "console-bot",
                name: "Console Bot"
            },
            conversation:  { 
                id: "conversation",
                name: "Conversation",
                isGroup: false
            },
            serviceUrl: ""
        } as ConversationReference;
    }

    public processActivity(callback: (context: TurnContext) => Promise<void>): void {
        const read: ReadLine = createInterface(this._lineOptions);
        read.on("line", (text: string) => {
            const activity: Partial<Activity> = TurnContext.applyConversationReference({
                    type: "message",
                    id: (this._nextID++).toString(),
                    timestamp: new Date(),
                    text: text
                },
                this._ref,
                true);
            this.runMiddleware(new TurnContext(this, activity), callback).catch((err: Error) => {
                console.error(err.toString());
            });
        });
    }

    public continueConversation(ref: ConversationReference, callback: (context: TurnContext) => Promise<void>): Promise<void> {
            const activity: Partial<Activity> = TurnContext.applyConversationReference({}, ref, true);
            return this.runMiddleware(new TurnContext(this, activity), callback).catch((err: Error) => {
                console.error(err.toString());
            });
    }

    public sendActivities(context: TurnContext, activities: Partial<Activity>[]): Promise<ResourceResponse[]> {
        return new Promise((resolve: any): void => {
            function next(i: number): void {
                if (i < activities.length) {
                    responses.push(<ResourceResponse>{});
                    const activity: Partial<Activity> = activities[i];
                    switch (activity.type) {
                        case "message":
                            console.log(activity.text || "");
                            break;
                        default:
                            console.log(`[${activity.type}] is not supported.`);
                            break;
                    }
                    next(i + 1);
                } else {
                    resolve(responses);
                }
            }
            const responses: ResourceResponse[] = [];
            next(0);
        });
    }

    public updateActivity(context: TurnContext, activity: Partial<Activity>): Promise<void> {
        return Promise.reject(new Error("[updateActivity] is not supported."));
    }

    public deleteActivity(context: TurnContext, reference: Partial<ConversationReference>): Promise<void> {
        return Promise.reject(new Error("[deleteActivity] is not supported."));
    }

}
