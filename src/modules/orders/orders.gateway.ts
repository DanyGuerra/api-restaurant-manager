import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { JwtService } from '@nestjs/jwt';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
    cors: {
        path: '/socket.io',
        origin: "*",
        credentials: false,
    },
})
export class OrdersGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly logger = new Logger(OrdersGateway.name);

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
                this.logger.warn({ clientId: client.id }, 'Client missing auth token, disconnecting...');
                client.disconnect();
                return;
            }

            const payload = this.jwtService.verify(token);
            this.logger.log({ clientId: client.id, userId: payload.sub }, 'Client connected');

            client.data.user = payload;
        } catch (e) {
            this.logger.error({ err: e, clientId: client.id }, 'Client failed auth, disconnecting...');
            client.disconnect();
        }
    }

    handleDisconnect(client: Socket) {
        this.logger.log({ clientId: client.id }, 'Client disconnected');
    }

    @SubscribeMessage('joinBusiness')
    handleJoinBusiness(client: Socket, businessId: string) {
        client.join(businessId);
        this.logger.log({ clientId: client.id, businessId }, 'Client joined business room');
        return { event: 'joinedBusiness', data: businessId };
    }

    @SubscribeMessage('leaveBusiness')
    handleLeaveBusiness(client: Socket, businessId: string) {
        client.leave(businessId);
        this.logger.log({ clientId: client.id, businessId }, 'Client left business room');
        return { event: 'leftBusiness', data: businessId };
    }
}
