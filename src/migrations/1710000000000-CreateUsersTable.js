class CreateUsersTable1710000000000 {
  name = 'CreateUsersTable1710000000000';

  async up(queryRunner) {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "users" (
        "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
        "name" varchar(255) NOT NULL,
        "email" varchar(255) NOT NULL UNIQUE,
        "password" varchar(255) NOT NULL,
        "role" varchar(20) NOT NULL,
        "phone" varchar(50),
        "city" varchar(100),
        "country" varchar(100),
        "createdAt" datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }

  async down(queryRunner) {
    await queryRunner.query(`DROP TABLE IF EXISTS "users"`);
  }
}

module.exports = { CreateUsersTable1710000000000 };

