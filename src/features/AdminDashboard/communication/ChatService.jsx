import { getAuthData } from "../../../config/Config";

// ........................Get Auth Token.......................... //



// ------------------ **WebSocket Connection for Chat List** ------------------ //
export const connectWebSocketForChatList = ({ onMessage, onSeen }) => {

    let token = null;
    try {
        const { accessToken } = getAuthData();
        token = accessToken;
    } catch (e) {
        console.error("Failed to get auth data:", e);
        return null; // stop if token not found
    }
    if (!token) {
        console.error("No access token found, cannot connect WebSocket");
        return null;
    }

    const wsProtocol = window.location.protocol === "https:" ? "wss" : "ws";
    const wsUrl = `${wsProtocol}://10.10.13.2:8000/ws/rooms/?token=${token}`;
    const socket = new WebSocket(wsUrl);
    socket.onopen = () => console.log("✅ WebSocket connected for Chat List");


    socket.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);
            console.log("📩 WS message:", data);

            switch (data.type) {
                case "room_list_update":
                    onMessage?.(data.message ?? data)
                    break

                case "messages_seen_update":
                    onSeen?.(data.message_ids, data.seen_by)
                    break

                default:
                    console.warn("Unknown WS event type:", data.type)
                    onMessage?.(data)
            }
        } catch (err) {
            console.error("Failed to parse WebSocket message:", err)
        }
    };


    socket.onclose = () =>
        console.log("❌ WebSocket disconnected for Chat List");
    socket.onerror = (e) => console.error("⚠️ WebSocket error", e);

    return socket;
};



// ---------------------- **WebSocket Connection for Chat** ------------------------- //
export const connectWebSocketForChat = ({ roomId, onMessage, onSeen }) => {

    // If Room ID is not provided, do not attempt to connect and return null
    if (!roomId) {
        console.error("No roomId provided, cannot connect WebSocket for Chat");
        return null;
    }
    // ...........................Get Auth Token................................ //
    let token = null;
    try {
        const { accessToken } = getAuthData();
        token = accessToken;
    } catch (e) {
        console.error("Failed to get auth data:", e);
        return null; // stop if token not found
    }
    if (!token) {
        console.error("No access token found, cannot connect WebSocket");
        return null;
    }

    // ........................WebSocket Connection.......................... //
    const wsProtocol = window.location.protocol === "https:" ? "wss" : "ws";
    const wsUrl = `${wsProtocol}://10.10.13.2:8000/ws/chat/${roomId}/?token=${token}`;
    const socket = new WebSocket(wsUrl);
    socket.onopen = () => console.log("✅ WebSocket connected for Chat List");


    socket.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);
            console.log("📩 WS message:", data);

            switch (data.type) {
                case "room_list_update":
                    onMessage?.(data.message ?? data)
                    break

                case "messages_seen_update":
                    onSeen?.(data.message_ids, data.seen_by)
                    break

                default:
                    console.warn("Unknown WS event type:", data.type)
                    onMessage?.(data)
            }
        } catch (err) {
            console.error("Failed to parse WebSocket message:", err)
        }
    };


    socket.onclose = () =>
        console.log("❌ WebSocket disconnected for Chat List");
    socket.onerror = (e) => console.error("⚠️ WebSocket error", e);

    return socket;
};
