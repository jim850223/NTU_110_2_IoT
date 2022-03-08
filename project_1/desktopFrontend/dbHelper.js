const db = require('better-sqlite3')('./data.db');

module.exports = {
    createUser: (data)=>{
        //INSERT
        db.prepare("INSERT INTO [users] (name, email, password, type, phone) VALUES (@name, @email, @password, @type, @phone)")
        .run({
            name: data.name,
            email: data.email,
            password: data.password,
            type: data.type,
            phone: data.phone
        });
        return db.prepare("SELECT max(id) AS 'id' FROM [users]").get().id;
    },
    updateUser: (id, name, phone)=>{
        //INSERT
        db.prepare("UPDATE [users] SET name=@name, phone=@phone WHERE id=@id")
        .run({
            id: id,
            name: name,
            phone: phone
        });
        let user = db.prepare("SELECT * FROM [users] WHERE id=@id").get({ id: id});
        return user;
    },
    signIn: (email, password)=>{
        let user = db.prepare("SELECT * FROM [users] WHERE email=@email AND password=@password")
                    .get({email: email, password: password});
        return user;
    },
    getUserInfo: (email, password)=>{
        let user = db.prepare("SELECT * FROM [users] WHERE email=@email AND password=@password")
                    .get({email: email, password: password});
        return user;
    },
    getUserInfoById: (id)=>{
        let user = db.prepare("SELECT * FROM [users] WHERE id=@id").get({id: id});
        return user;
    },
    isEmailExists: (email)=>{
        let user = db.prepare("SELECT * FROM [users] WHERE email=@email").get({email: email});
        return user != undefined;
    },
    ////////////////////////////////////////////
    createProduct: (data)=>{
        //INSERT
        db.prepare("INSERT INTO [products] (name, description, picture, inventory, price, startSaleTime, endSaleTime, user_id) VALUES (@name, @description, @picture, @inventory, @price, @startSaleTime, @endSaleTime, @user_id)")
        .run({
            name: data.name,
            description: data.description,
            picture: data.picture,
            inventory: data.inventory,
            price: data.price,
            startSaleTime: data.startSaleTime,
            endSaleTime: data.endSaleTime,
            user_id: data.userId
        });
        return db.prepare("SELECT max(id) AS 'id' FROM [products]").get().id;
    },
    getProducts: ()=>{
        let rows = db.prepare("SELECT * FROM [products]").all();
        rows.forEach((x)=>delete x.user_id);
        return rows;
    },
    getProduct: (id)=>{
        let row = db.prepare("SELECT * FROM [products] WHERE id=@id").get({id: id});
        if(row) delete row.user_id
        return row;
    },
    updateProduct: (data)=>{
        db.prepare("UPDATE [products] SET name=@name, description=@description, picture=@picture, inventory=@inventory, startSaleTime=@startSaleTime, endSaleTime=@endSaleTime WHERE user_id=@user_id AND id=@id")
        .run({
            id: data.id,
            name: data.name,
            description: data.description,
            picture: data.picture,
            inventory: data.inventory,
            startSaleTime: data.startSaleTime,
            endSaleTime: data.endSaleTime,
            user_id: data.user_id
        });
        let product = db.prepare("SELECT * FROM [products] WHERE id=@id AND user_id=@user_id").get({ id: data.id, user_id: data.user_id});
        return product;
    },
    deleteProduct: (id, user_id)=>{
        let product = db.prepare("SELECT * FROM [products] WHERE id=@id AND user_id=@user_id").get({ id: id, user_id: user_id});
        db.prepare("DELETE FROM [products] WHERE id=@id AND user_id=@user_id").run({id: id, user_id: user_id});
        return product != undefined;
    },
    ////////////////////////////////////////////
    createOrder: (data)=>{
        let insertOrder = db.transaction((data)=>{
            let insert_orders = db.prepare('INSERT INTO orders (id, amount, product_id, user_id, timestamp) VALUES (@id, @amount, @product_id, @user_id, @timestamp)');

            let timestamp = new Date().toISOString().slice(0, 10);
            let id = db.prepare("SELECT max(id) AS 'id' FROM [orders]").get().id + 1;
            let products = [];
            for(let i=0; i<data.orders.length; i++){
                let order = data.orders[i];
                insert_orders.run({
                    id: id,
                    amount: order.amount,
                    product_id: order.productId,
                    user_id: data.user_id, 
                    timestamp: timestamp
                });
                let product = db.prepare("SELECT * FROM [products] WHERE id=@id").get({id: order.productId});
                pr = {
                    "name": product.name,
                    "description": product.description,
                    "picture": product.picture,
                    "price": product.price,
                    "amount": order.amount
                }
                products.push(pr);
            }

            let user = db.prepare("SELECT * FROM [users] WHERE id=@id").get({id: data.user_id});
            let ret = {
                "id": id,
                "buyerName": user.name,
                "buyerEmail": user.email,
                "buyerPhone": user.phone,
                "timestamp": timestamp,
                "products": products
            }
            return ret;
        });
        
       
        return insertOrder(data);
    },
    getOrders: (user_id)=>{
        let rows = db.prepare(`
        SELECT o.id,o.amount,o.timestamp,
        u.name AS buyerName,u.email AS buyerEmail,u.phone AS buyerPhone,
        p.name,p.description,p.picture,p.price
        FROM [orders] AS o
        LEFT JOIN [users] AS u
        ON o.user_id = u.id
        LEFT JOIN [products] AS p
        ON o.product_id = p.id
        WHERE o.user_id = @user_id
        `).all({user_id: user_id});
        orders = {};
        for(let i in rows){
            if (orders[rows[i]['id']] == undefined)
                orders[rows[i]['id']] = [];
            orders[rows[i]['id']].push(rows[i]);
        }

        let ret_data = [];
        for(let order_id in orders){
            let orderRecords = orders[order_id];
            let order = {};
            for (let i=0; i<orderRecords.length; i++){
                let orderRecord = orderRecords[i];
                if(i == 0){
                    order["id"] = order_id;
                    order["buyerName"] = orderRecord.buyerName;
                    order["buyerEmail"] = orderRecord.buyerEmail;
                    order["buyerPhone"] = orderRecord.buyerPhone;
                    order["timestamp"] = orderRecord.timestamp;
                    order["products"] = [];
                }
                order["products"].push({
                    "name": orderRecord.name,
                    "description": orderRecord.description,
                    "picture": orderRecord.picture,
                    "price": orderRecord.price,
                    "amount": orderRecord.amount
                })
            }
            ret_data.push(order);
        }
       
        return ret_data;
    },
    getOrder: (user_id, id)=>{
        let rows = db.prepare(`
        SELECT o.id,o.amount,o.timestamp,
        u.name AS buyerName,u.email AS buyerEmail,u.phone AS buyerPhone,
        p.name,p.description,p.picture,p.price
        FROM [orders] AS o
        LEFT JOIN [users] AS u
        ON o.user_id = u.id
        LEFT JOIN [products] AS p
        ON o.product_id = p.id
        WHERE o.user_id = @user_id AND o.id=@id
        `).all({user_id: user_id, id: id});
        let ret_data = {};
        for (let i=0; i<rows.length; i++){
            let orderRecord = rows[i];
            if(i == 0){
                ret_data["id"] = id;
                ret_data["buyerName"] = orderRecord.buyerName;
                ret_data["buyerEmail"] = orderRecord.buyerEmail;
                ret_data["buyerPhone"] = orderRecord.buyerPhone;
                ret_data["timestamp"] = orderRecord.timestamp;
                ret_data["products"] = [];
            }
            ret_data["products"].push({
                "name": orderRecord.name,
                "description": orderRecord.description,
                "picture": orderRecord.picture,
                "price": orderRecord.price,
                "amount": orderRecord.amount
            })
        }
       
        return ret_data;
    },
    ////////////////////////////////////////////
    createPicture: (user_id, data)=>{
        db.prepare("INSERT INTO [pictures] (user_id, data) VALUES (@user_id, @data)").run({user_id: user_id, data: data.buffer});
        return db.prepare("SELECT max(id) AS 'id' FROM [pictures] WHERE user_id=@user_id").get({user_id: user_id}).id;
    },
    getPicture: (id)=>{
        let row = db.prepare("SELECT * FROM [pictures] WHERE id=@id").get({id: id});
        return row;
    },
};