import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Employee } from "./Employee";

@Entity()
export class Role {
    @PrimaryGeneratedColumn()
    roleId!: number;

    @Column({ length: 255 })
    title!: string;

    @Column("text")
    description!: string;

    @OneToMany(() => Employee, (employee) => employee.role)
    employees!: Employee[];
}
