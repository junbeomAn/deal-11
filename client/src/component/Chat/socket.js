import { io } from 'socket.io-client';
// const CHAT_SERVER = 'http://localhost:8000';
const CHAT_SERVER = 'http://ec2-3-35-50-169.ap-northeast-2.compute.amazonaws.com:8000';
const socket = io(CHAT_SERVER, {
   withCredentials: true,
 });
export default socket;
