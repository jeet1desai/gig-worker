const { io } = require('socket.io-client');

type Socket = {
  id?: string;
  connected: boolean;
  on: (event: string, callback: (...args: any[]) => void) => void;
  off: (event: string, callback?: (...args: any[]) => void) => void;
  emit: (event: string, ...args: any[]) => void;
  disconnect: () => void;
  connect: () => void;
};

class SocketManager {
  private static instance: SocketManager;
  private socket: Socket | null = null;
  private subscribers: Array<() => void> = [];
  private isConnected = false;
  private reconnectAttempts = 0;
  private readonly maxReconnectAttempts = 5;
  private readonly eventListeners = new Map<string, (...args: any[]) => void>();

  private constructor() {
    if (typeof window !== 'undefined') {
      this.initialize();
    }
  }

  public static getInstance(): SocketManager {
    if (!SocketManager.instance) {
      SocketManager.instance = new SocketManager();
    }
    return SocketManager.instance;
  }

  private initialize() {
    if (typeof window === 'undefined') return;
    if (this.socket?.connected) return;

    try {
      this.socket = io({
        path: '/api/socket',
        reconnection: true,
        reconnectionAttempts: this.maxReconnectAttempts,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        timeout: 20000,
        autoConnect: true,
        transports: ['websocket', 'polling'],
      });

      this.setupEventListeners();
    } catch (error) {
      console.error('Failed to initialize socket:', error);
    }
  }

  private setupEventListeners() {
    if (!this.socket) return;

    const onConnect = () => {
      this.isConnected = true;
      this.reconnectAttempts = 0;
      this.notifySubscribers();
    };

    const onDisconnect = () => {
      this.isConnected = false;
      this.notifySubscribers();
    };

    const onConnectError = (error: Error) => {
      console.error('Socket connection error:', error);
      this.reconnectAttempts++;
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('Max reconnection attempts reached');
      }
    };

    this.socket.on('connect', onConnect);
    this.socket.on('disconnect', onDisconnect);
    this.socket.on('connect_error', onConnectError);

    return () => {
      if (this.socket) {
        this.socket.off('connect', onConnect);
        this.socket.off('disconnect', onDisconnect);
        this.socket.off('connect_error', onConnectError);
      }
    };
  }

  public getSocket() {
    return this.socket;
  }

  public getIsConnected() {
    return this.isConnected;
  }

  public subscribe(callback: () => void) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter((cb) => cb !== callback);
    };
  }

  public on<T = any>(event: string, callback: (data: T) => void): () => void {
    if (!this.socket) {
      return () => {};
    }

    const listener = (data: T) => {
      try {
        callback(data);
      } catch (error) {
        console.error(`Error handling event ${event}:`, error);
      }
    };

    this.socket.on(event, listener);
    this.eventListeners.set(`${event}:${callback.toString()}`, listener);

    return () => {
      this.off(event, callback);
    };
  }

  public off(event: string, callback: (...args: any[]) => void): void {
    if (!this.socket) {
      return;
    }

    const listener = this.eventListeners.get(`${event}:${callback.toString()}`);
    if (listener) {
      this.socket.off(event, listener);
      this.eventListeners.delete(`${event}:${callback.toString()}`);
    }
  }

  public emit(event: string, ...args: any[]): void {
    if (this.socket && this.isConnected) {
      try {
        this.socket.emit(event, ...args);
      } catch (error) {
        console.error(`Error emitting event ${event}:`, error);
      }
    } else {
      console.warn('Cannot emit event - socket not connected');
    }
  }

  private notifySubscribers() {
    this.subscribers.forEach((callback) => callback());
  }
}

export const socketManager = SocketManager.getInstance();
