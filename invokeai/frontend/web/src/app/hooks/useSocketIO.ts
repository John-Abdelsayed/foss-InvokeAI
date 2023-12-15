import { useStore } from '@nanostores/react';
import { $authToken } from 'app/store/nanostores/authToken';
import { $baseUrl } from 'app/store/nanostores/baseUrl';
import { $isDebugging } from 'app/store/nanostores/isDebugging';
import { useAppDispatch } from 'app/store/storeHooks';
import { MapStore, atom, map } from 'nanostores';
import { useEffect, useMemo } from 'react';
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from 'services/events/types';
import { setEventListeners } from 'services/events/util/setEventListeners';
import { ManagerOptions, Socket, SocketOptions, io } from 'socket.io-client';

// Inject socket options and url into window for debugging
declare global {
  interface Window {
    $socketOptions?: MapStore<Partial<ManagerOptions & SocketOptions>>;
  }
}

export const $socketOptions = map<Partial<ManagerOptions & SocketOptions>>({});
export const $isSocketInitialized = atom<boolean>(false);

/**
 * Initializes the socket.io connection and sets up event listeners.
 */
export const useSocketIO = () => {
  const dispatch = useAppDispatch();
  const baseUrl = useStore($baseUrl);
  const authToken = useStore($authToken);
  const addlSocketOptions = useStore($socketOptions);

  const socketUrl = useMemo(() => {
    const wsProtocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    if (baseUrl) {
      return baseUrl.replace(/^https?:\/\//i, '');
    }

    return `${wsProtocol}://${window.location.host}`;
  }, [baseUrl]);

  const socketOptions = useMemo(() => {
    const options: Parameters<typeof io>[0] = {
      timeout: 60000,
      path: '/ws/socket.io',
      autoConnect: false, // achtung! removing this breaks the dynamic middleware
      forceNew: true,
    };

    if (authToken) {
      options.auth = { token: authToken };
      options.transports = ['websocket', 'polling'];
    }

    return { ...options, ...addlSocketOptions };
  }, [authToken, addlSocketOptions]);

  useEffect(() => {
    if ($isSocketInitialized.get()) {
      // Singleton!
      return;
    }

    const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
      socketUrl,
      socketOptions
    );
    setEventListeners({ dispatch, socket });
    socket.connect();

    if ($isDebugging.get()) {
      window.$socketOptions = $socketOptions;
      console.log('Socket initialized', socket);
    }

    $isSocketInitialized.set(true);

    return () => {
      if ($isDebugging.get()) {
        window.$socketOptions = undefined;
        console.log('Socket teardown', socket);
      }
      socket.disconnect();
      $isSocketInitialized.set(false);
    };
  }, [dispatch, socketOptions, socketUrl]);
};