export interface CommandHandler {
    determine(): any;
    handler(event: Event): void;
}
