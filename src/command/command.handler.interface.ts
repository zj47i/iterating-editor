export interface CommandHandler {
    determine(): any;
    handle(event: Event): void;
}
