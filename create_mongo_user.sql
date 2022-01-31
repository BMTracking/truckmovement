use motodey
 db.createUser(
    {
        user:"motodey",
        pwd:"motodey", 
        roles: [
             {
                role:"readWrite", 
                db:"motodey"
            }
        ]
    }
)