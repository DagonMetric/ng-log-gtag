export type GTag = (command: 'event' | 'config' | 'set', actionOrProperties: any, properties?: any) => void;
