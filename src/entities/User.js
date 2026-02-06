const { EntitySchema } = require('typeorm');

// User roles:
// - admin: can list all users and view any user details
// - staff: can only view their own details

const User = new EntitySchema({
  name: 'User',
  tableName: 'users',
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true
    },
    name: {
      type: String,
      length: 255,
      nullable: false
    },
    email: {
      type: String,
      length: 255,
      nullable: false,
      unique: true
    },
    password: {
      type: String,
      length: 255,
      nullable: false
    },
    role: {
      type: String,
      length: 20,
      nullable: false
    },
    phone: {
      type: String,
      length: 50,
      nullable: true
    },
    city: {
      type: String,
      length: 100,
      nullable: true
    },
    country: {
      type: String,
      length: 100,
      nullable: true
    },
    createdAt: {
      type: 'datetime',
      nullable: false,
      createDate: true
    },
    updatedAt: {
      type: 'datetime',
      nullable: false,
      updateDate: true
    }
  }
});

module.exports = {
  User
};

