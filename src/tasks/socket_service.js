// just open the communication at the beginning
// all the channels

// if gets new race created
// check if in race mode, and if correct agent
// and if yes, activate next task with something similar
// to fetchTasks callback - maybe abstract it away
//
// if switch to automatic race, stop the service
// as it would just put strain on the server

/* global SOCKET_URL */
import { receivedTasks } from './action_creators';

let socket;
let dispatch;

export function getSocketServer() {
  return `${SOCKET_URL}ws/chat/extension/`;
}

export function closeSocket(socket) {
  if (socket) {
    socket.close();
  }
}

export function addSocketCallbacks(socket, onMessage) {
  socket.onmessage = (e) => {
    onMessage(JSON.parse(e.data));
  };

  socket.onclose = (e) => {
    console.error('Chat socket closed unexpectedly');
  };
}

export function initSocket(onMessage) {
  closeSocket(socket);

  const url = getSocketServer();
  socket = new WebSocket(url);
  addSocketCallbacks(socket, onMessage);
}


export function onMessageCallback(socketData) {
  console.log('onMessageCallback', socketData);
  const { message } = socketData;

  if (message === 'race_started') {
    console.log('starting race');

    //  format received socket data so they are similar to tasks
    //  received from the REST API

    // {
    //   "keyword": "fox news",
    //   "id": 135,
    //   "tasks": [
    //     {"id": 269, "status": 1, "type": 1, "agent": 1, "session": null,
    //       "scenario": {"id": 268, "type": 1,
    //       "config": [
    //         {"settings": {"keyword": "fox news"}}
    //       ]}
    //     }
    //   ],
    //   "message": "race_started",
    //   "type": "chat_message"
    // }


    //  TODO - check that logged-in agent is on the list socketData.agents
    const response = socketData.tasks;
    dispatch(receivedTasks(response));
  }
}

export function startSocketService(dispatchRef) {
  dispatch = dispatchRef;

  console.log('startSocketService');
  initSocket(onMessageCallback);
}

export function stopSocketService() {
  console.log('stopSocketService');
  closeSocket(socket);
}
