import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { JwtService } from '@nestjs/jwt';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
    cors: {
        origin: process.env.HOST_FRONTEND,
        credentials: true,
    },
})
export class OrdersGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    constructor(
        private jwtService: JwtService,
    ) { }

    handleConnection(client: Socket) {
        try {
            const token =
                (client.handshake.auth?.token as string) ||
                (client.handshake.query?.token as string) ||
                client.handshake.headers.authorization;
            if (!token) {
                console.log(`Client ${client.id} missing auth token, disconnecting...`);
                client.disconnect();
                return;
            }

            const payload = this.jwtService.verify(token);
            console.log(`Client connected: ${client.id}, User: ${payload.sub}`);

            client.data.user = payload;
        } catch (e) {
            console.log(`Client ${client.id} failed auth, disconnecting...`, e.message);
            client.disconnect();
        }
    }

    handleDisconnect(client: Socket) {
        console.log(`Client disconnected: ${client.id}`);
    }

    @SubscribeMessage('joinBusiness')
    handleJoinBusiness(client: Socket, businessId: string) {
        client.join(businessId);
        console.log(`Client ${client.id} joined business room: ${businessId}`);
        return { event: 'joinedBusiness', data: businessId };
    }

    @SubscribeMessage('leaveBusiness')
    handleLeaveBusiness(client: Socket, businessId: string) {
        client.leave(businessId);
        console.log(`Client ${client.id} left business room: ${businessId}`);
        return { event: 'leftBusiness', data: businessId };
    }
}
