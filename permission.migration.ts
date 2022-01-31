import {MigrationInterface, QueryRunner, Table, TableIndex, TableColumn, TableForeignKey } from "typeorm";

export class PermissionRefactoringTIMESTAMP implements MigrationInterface {

    async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "permissions",
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true
                },
                {
                    name: "service",
                    type: "varchar",
                },
                {
                    name: "path",
                    type: "varchar",
                },
                {
                    name: "createdAt",
                    type: "timestamp",
                },
                {
                    name: "updatedAt",
                    type: "timestamp",
                },
                {
                    name: "deletedAt",
                    type: "timestamp",
                }
            ]
        }), true)

        await queryRunner.createIndex("permissions", new TableIndex({
            name: "IDX_PERMISSION_SERVICE_PATH",
            columnNames: ["service", "path"]
        }));

    }

    async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("question");
    }

}