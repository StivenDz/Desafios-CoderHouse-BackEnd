import fs from "fs";
import Path from "path";
import { randomUUID } from "crypto";
import { Product } from "@types";
import { SQLFunctions } from "../../functions/SQLFunctions";

export class ProductRepository{
    private static path:string = Path.join(__dirname,"../../../products.json");

    private static writeData(data:string):void{
        try{
            return fs.writeFileSync(this.path,data);
        }catch(err){
            throw new Error("Error writing the Data");
        }
    }
    public static INSERT(product:Product):Array<Product>{
        try{
            const products = this.SELECT();
            product = {
                ...product,
                id: SQLFunctions.id_AutoIncrement(products),
                productId:randomUUID(),
                created_At: SQLFunctions.formatDate(new Date())
            }
            products.push(product);
            this.writeData(JSON.stringify(products,null,2));

            return products
        }catch(err){
            throw new Error("Error adding new Data")
        }
    }
    public static SELECT():Array<Product>{
        try{
            return JSON.parse(fs.readFileSync(this.path,"utf-8"));
        }catch(err){
            throw new Error(`Error reading the file in this route ${this.path}`);
        }
    }
    public static SELECT_ID(id:string):Product|null{
       try{
            const products = this.SELECT();
            const productSelected = products.filter((product:Product)=> product.productId == id);

            if(productSelected.length) return productSelected[0]
            else return null

        }catch(err){
            throw new Error(`Error`)
        }
    }
    public static UPDATE(id:string,productUpdated:Product):Array<Product>{
        try{
            const products = this.SELECT();
            const productsUpdated = products.map((product:Product)=>
                product.productId === id ? {...productUpdated,id:product.id,productId:product.productId} : product
            );
            this.writeData(JSON.stringify(productsUpdated,null,2));
            return productsUpdated;
        }catch(err){
            throw new Error(`Error adding ${productUpdated}`)
        }
    }
    public static DELETE(id:string):boolean{
        try{
            const products = this.SELECT();
            const productsUpdated = products.filter((product:Product)=> (product.productId != id));
            this.writeData(JSON.stringify(productsUpdated,null,2));
            return true

        }catch(err){
            throw new Error(`Error deleting ${id}`)
        }
    }
}