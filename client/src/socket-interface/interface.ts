export interface ServerToClientEvents {
    noArg: () => void;
    basicEmit: (a: number, b: string, c: Buffer) => void;
    withAck: (d: string, callback: (e: number) => void) => void;

    receive_message: (data: IMessageData) => void;
    receive_status: (data: boolean) => void;
}

export interface ClientToServerEvents {
    // hello: () => void;
    join_room: (relation_id: number) => void;
    send_message: (messageData: IMessageData, relation_id: number) => void;
    set_online_status: (isOnline: boolean, relationId: number) => void;
}

export interface InterServerEvents {
    ping: () => void;
}

export interface IMessageData {
    sent_time: string,
    sender_id: number,
    relation_id: number,
    words: string,
}