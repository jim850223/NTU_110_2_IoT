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
    createLog: (data)=>{
        //INSERT
        db.prepare("INSERT INTO [logs] (time, event, url, userId, deviceId) VALUES (@time, @event, @url, @userId, @deviceId)")
        .run({
            time: data.time,
            event: data.event,
            url: data.url,
            userId: data.userId,
            deviceId: data.deviceId,
        });
    },
    getLogs: (userId)=>{
        let rows = db.prepare("SELECT * FROM [logs] WHERE userId=@userId").all({userId: userId});
        return rows;
    },
    createVoiceMsg: (data)=>{
        //INSERT
        db.prepare("INSERT INTO [voiceMessages] (time, photo_url, voice_url, userId, deviceId) VALUES (@time, @photo_url, @voice_url, @userId, @deviceId)")
        .run({
            time: data.time,
            photo_url: data.photo_url,
            voice_url: data.voice_url,
            userId: data.userId,
            deviceId: data.deviceId,
        });
    },
    getVoiceMsgs: (userId)=>{
        let rows = db.prepare("SELECT * FROM [voiceMessages] WHERE userId=@userId").all({userId: userId});
        return rows;
    },
};