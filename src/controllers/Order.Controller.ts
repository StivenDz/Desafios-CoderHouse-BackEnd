import { Request, Response } from "express";
import { Controller } from "../decorators/Controller.dec";
import { GET, POST } from "../decorators/Http.dec";
import { Inject } from "../decorators/Injectable.dec";
import { Middleware } from "../decorators/Middleware.dec";
import { JWT } from "../middlewares/JWT.Middleware";
import { OrderService } from "../services/Order.Service";
import { JWT as JWT_util } from "../utils/JWT.util";
import { UserEntity } from "../models/Entity/User.Entity";

@Controller("orders")
export class OrderController {

    @Inject("orderService")
    private orderService!: OrderService;

    @Middleware(JWT.verifyToken)
    @GET()
    public async getOrder(req: Request, res: Response) {
        try {
            const user: UserEntity = this.getUser(req);
            const orders = await this.orderService.getByUserId(user.userId);
            if (!orders || !orders.length) res.status(200).json({ message: "this user doesn't have orders" });
            else res.status(200).json({ orders });
        } catch (ex: any) {
            res.status(500).json({ error: ex.message });
        }
    }

    @Middleware(JWT.verifyToken)
    @POST()
    public async addOrder(req: Request, res: Response) {
        try {
            const user: UserEntity = this.getUser(req);
            const response = await this.orderService.buyCart(user);
            if (response.error) res.status(400).json({ error: response.error });
            else res.status(201).json({ order: response.order });
        } catch (ex: any) {
            res.status(500).json({ error: ex.message });
        }
    }

    private getUser(req: Request) {
        return JWT_util.DecryptToken(JWT.getToken(req))
    }
}