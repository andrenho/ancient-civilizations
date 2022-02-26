export default interface UiInterface {
    redraw(): void;
    onKeyDown(event: KeyboardEvent): void;
}