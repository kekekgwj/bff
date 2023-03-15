import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn({ type: 'int'} )
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  mail: string;

  @Column()
  login: string;
}
