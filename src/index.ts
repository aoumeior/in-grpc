import { Client } from "./client";



Client.start();
Client.on("Message", function (message: string) {
    console.log(message);
});

Client.push({ "id": "ccc", "messagetype": Client.MessageType.Person, message: "fdsf" });
Client.push({ "id": "ccc", "messagetype": Client.MessageType.Person, message: "fdsf" });
Client.push({ "id": "ccc", "messagetype": Client.MessageType.Person, message: "fdsf" });
Client.push({ "id": "ccc", "messagetype": Client.MessageType.Person, message: "fdsf" });
Client.push({ "id": "ccc", "messagetype": Client.MessageType.Person, message: "fdsf" });
Client.push({ "id": "ccc", "messagetype": Client.MessageType.Person, message: "fdsf" });
Client.push({ "id": "ccc", "messagetype": Client.MessageType.Person, message: "fdsf" });
Client.push({ "id": "ccc", "messagetype": Client.MessageType.Person, message: "fdsf" });
Client.push({ "id": "ccc", "messagetype": Client.MessageType.Person, message: "fdsf" });
Client.push({ "id": "ccc", "messagetype": Client.MessageType.Person, message: "fdsf" });