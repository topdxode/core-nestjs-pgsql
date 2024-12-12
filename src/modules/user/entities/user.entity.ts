import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	DeleteDateColumn,
	BeforeInsert,
	BeforeUpdate,
} from 'typeorm';
import * as moment from 'moment';

@Entity('users')
export class User {
	@PrimaryGeneratedColumn({ name: 'id' })
	id?: number;

	@Column({ name: 'first_name' })
	firstName: string;

	@Column({ name: 'last_name' })
	lastName: string;

	@Column({ name: 'user_name', length: 50, unique: true })
	userName: string;

	@Column({ name: 'email', unique: true })
	email: string;

	@Column({ name: 'password' })
	password: string;

	@Column({ name: 'created_at', type: 'timestamp', nullable: true })
	createdAt: Date;

	@Column({ name: 'updated_at', type: 'timestamp', nullable: true })
	updatedAt: Date;

	@DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
	deletedAt: Date;

	@BeforeInsert()
	setCreatedAt() {
		this.createdAt = moment().utcOffset(7).toDate();
	}

	@BeforeInsert()
	@BeforeUpdate()
	setUpdatedAt() {
		this.updatedAt = moment().utcOffset(7).toDate();
	}
}