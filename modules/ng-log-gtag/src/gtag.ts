export type GTag = (command: 'event' | 'config' | 'set', actionOrProperties: unknown, properties?: unknown) => void;
