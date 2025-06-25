import { MigrationInterface, QueryRunner } from "typeorm";

export class InitMigration1750835251012 implements MigrationInterface {
    name = 'InitMigration1750835251012'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`newsletters\` (\`id\` varchar(36) NOT NULL, \`email\` varchar(255) NOT NULL, \`isSubscribed\` tinyint NOT NULL DEFAULT 1, \`creation_date\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_a2464613407914bce01f4cae61\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_a2464613407914bce01f4cae61\` ON \`newsletters\``);
        await queryRunner.query(`DROP TABLE \`newsletters\``);
    }

}
