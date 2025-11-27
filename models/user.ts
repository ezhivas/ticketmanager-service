import {Model, DataTypes, Optional} from 'sequelize';
import sequelize from '../config/database';

interface UserAttributes{
    id:number;
    username:string;
    email:string;
    password?:string;
    role: 'user' | 'admin';
    createdAt?:Date;
    updatedAt?:Date;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'>{}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    public id!:number;
    public username!:string;
    public email!:string;
    public password!:string;
    public role!: 'user' | 'admin';

    public readonly createdAt!:Date;
    public readonly updatedAt!:Date;
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        role: {
            type: DataTypes.ENUM('user', 'admin'),
            allowNull: true,
            defaultValue: 'user',
        },
    },
    {
        sequelize,
        tableName: 'Users',
    }
)

export default User;
