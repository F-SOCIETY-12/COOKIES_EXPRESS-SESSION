const Sequelize = require('sequelize')

const db = new Sequelize(
{
dialect : 'sqlite',
storage: __dirname + '/users.db'    ///thats how sqlite works
})

const Users = db.define('user',{     ///ek pura user model class hai 
    id : {
        type : Sequelize.DataTypes.INTEGER,
        primaryKey : true,
        autoIncrement : true
    },
    username :{
        type : Sequelize.DataTypes.STRING(40),
        unique : true,
        allowNull : false
    },
    email : {
        type : Sequelize.DataTypes.STRING(100),        
    },
    password : {
        type : Sequelize.DataTypes.STRING,
        allowNull : false
    }
}) 
module.exports={
    db,Users
}

